import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import { postCommentOnPullRequest } from './github'
import { convertCdkDiffToMarkdown } from './transform'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  let output = ''
  let error = ''

  const options: exec.ExecOptions = {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      },
      stderr: (data: Buffer) => {
        error += data.toString()
      }
    }
  }

  try {
    const repoToken: string = core.getInput('repo-token')

    // Execute the CDK diff command
    await exec.exec('cdk diff --progress=events', [], options)

    // Optional: Write the output to a file if needed
    fs.writeFileSync('cdk.log', output)

    // Process the output as needed
    const markdown = await convertCdkDiffToMarkdown(output)
    await postCommentOnPullRequest(repoToken, markdown)
  } catch (err) {
    // Fail the workflow run if an error occurs
    if (error) {
      core.setFailed(error)
    } else if (err instanceof Error) {
      core.setFailed(err.message)
    }
  }
}
