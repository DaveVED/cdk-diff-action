import { Octokit } from '@octokit/core';
import * as github from '@actions/github';

export const postCommentOnPullRequest = async (repoToken: string, diffOutput: string) => {
    const octokit = new Octokit({ auth: repoToken });
    const context = github.context;

    if (context.issue.number) {
      const comment = `
  ## CDK Diff Summary
  <details>
  <summary>Show Diff</summary>
  
  \`\`\`
  ${diffOutput}
  \`\`\`
  
  </details>
  `;
  
      await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: comment
      });
    }
  }