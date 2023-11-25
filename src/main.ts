import * as core from '@actions/core'
import { postCommentOnPullRequest } from './github';
import { convertToMarkdown } from './transform';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const repoToken: string = core.getInput('repo-token')

    const markdown = await convertToMarkdown("./test/diff-files/cdk_log_simple_add.log");
    await postCommentOnPullRequest(repoToken, markdown);
    
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}