import { Octokit } from '@octokit/core'
import * as github from '@actions/github'

export const postCommentOnPullRequest = async (
  repoToken: string,
  diffOutput: string
): Promise<void> => {
  const octokit = new Octokit({ auth: repoToken })
  const context = github.context

  if (context.issue.number) {
    const comment = `
  ## CDK Diff Summary
  <details>
  <summary>Show Diff</summary>
  
  \`\`\`diff
  ${diffOutput}
  \`\`\`
  
  </details>
  `

    await octokit.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner: 'daveved',
        repo: 'cdk-diff-action/',
        issue_number: 3,
        body: comment
      }
    )
  }
}

export const truncateCommentOnPullRequestContent = (
  content: string[]
): string => {
  let truncatedContent = content.join('\n')
  if (truncatedContent.length > 65000) {
    truncatedContent = `${truncatedContent.slice(0, 65000)}\n...truncated`
  }

  return truncatedContent
}
