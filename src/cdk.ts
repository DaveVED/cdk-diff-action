import * as fs from 'fs'
import * as readline from 'readline'

export const getTokenType = (line: string): string => {
  return line.trim().substring(0, 3)
}

export const formatChangeLogEntry = (line: string): string => {
  return `- ${line.trim().substring(3).trim()}`
}

export const processLine = (
  line: string,
  addedLines: string[],
  updatedLines: string[],
  removedLines: string[]
): void => {
  const changeType = getTokenType(line)
  const formattedLine = formatChangeLogEntry(line)

  switch (changeType) {
    case '[+]':
      addedLines.push(formattedLine)
      break
    case '[-]':
      removedLines.push(formattedLine)
      break
    case '[~]':
      updatedLines.push(formattedLine)
      break
  }
}

export const buildMarkdownSections = (
  addedLines: string[],
  updatedLines: string[],
  removedLines: string[]
): string[] => {
  let markdownContent = ['## 📚 Resources']

  if (addedLines.length) {
    markdownContent.push('\n### ✨ Added\n', ...addedLines)
  }

  if (updatedLines.length) {
    markdownContent.push('\n### 🔄 Updated\n', ...updatedLines)
  }

  if (removedLines.length) {
    markdownContent.push('\n### ❌ Removed\n', ...removedLines)
  }

  return markdownContent
}

export const convertToMarkdown = async (filePath: string, repoToken: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    let addedLines: string[] = []
    let updatedLines: string[] = []
    let removedLines: string[] = []
    let inResourcesSection = false

    rl.on('line', line => {
      if (line.trim() === 'Resources') {
        inResourcesSection = true
      } else if (line.trim() === 'Other Changes') {
        inResourcesSection = false
      } else if (inResourcesSection) {
        processLine(line, addedLines, updatedLines, removedLines)
      }
    })

    rl.on('close', async () => {
      const markdownContent = buildMarkdownSections(
        addedLines,
        updatedLines,
        removedLines
      )
      const content = markdownContent.join('\n')
      await postCommentOnPullRequest(content, 'daveved', 'cdk-diff-action', 1)
      resolve(content)
    })

    rl.on('error', err => {
      reject(err)
    })
  })
}

export const postCommentOnPullRequest = async (
  content: string,
  repoOwner: string,
  repoName: string,
  pullRequestNumber: number
) => {
  const token = process.env.GITHUB_ACCESS_TOKEN

  if (!token) {
    console.error('GitHub access token is not set.')
    return
  }

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${pullRequestNumber}/comments`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body: content })
    })

    if (!response.ok) {
      throw new Error(
        `GitHub API responded with status code: ${response.status}`
      )
    }

    const data = await response.json()

    if (data && data.id) {
      console.log('Comment posted successfully. Comment ID:', data.id)
    } else {
      throw new Error('Invalid response format from GitHub API.')
    }
  } catch (error) {
    console.error('Error posting comment:', error)
  }
}
