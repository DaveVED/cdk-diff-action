import * as fs from 'fs'
import * as readline from 'readline'
import { truncateCommentOnPullRequestContent } from './github'

export const REGEX_NUMBER_OF_DIFFERENCES_STRING =
  /Number of stacks with differences:.*/

// eslint-disable-next-line no-control-regex
export const REGEX_ANSI_ESCAPE_CODES = /\x1b\[[0-9;]*m/g

export const REGEX_REQUIRES_REPLACEMENT =
  /\(requires replacement\)|\(may cause replacement\)/

export const REGEX_MARKDOWN_DIFF_STRING = /(?:\[(\+|-+)\])|(?:│\s(\+|-)\s│)/

export const isNumberOfDifferencesString = (input: string): boolean => {
  return REGEX_NUMBER_OF_DIFFERENCES_STRING.test(input)
}

export const replaceAnsiEscapeCodes = (input: string): string => {
  return input.replace(REGEX_ANSI_ESCAPE_CODES, '')
}

export const containsReplacementPhrase = (input: string): boolean => {
  return REGEX_REQUIRES_REPLACEMENT.test(input)
}

export const findDiffSymbol = (line: string): string => {
  const matches = line.match(REGEX_MARKDOWN_DIFF_STRING)
  if (matches) {
    for (let i = 1; i < matches.length; i++) {
      if (matches[i]) {
        return matches[i]
      }
    }
  }
  return ''
}

export const trimLineIfNeeded = (line: string, symbol: string): string => {
  if (symbol !== '' && !line.startsWith('[')) {
    return line.substring(1)
  }
  return line
}

export const convertToDiff = (line: string): string => {
  const foundSymbol = findDiffSymbol(line)
  const trimmedLine = trimLineIfNeeded(line, foundSymbol)
  return foundSymbol !== '' ? foundSymbol + trimmedLine : trimmedLine
}

export const convertCdkDiffToMarkdown = async (
  filePath: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const markdownContent: string[] = []
    const numberOfDiffs: string[] = []
    let numberOfReplacements = 0

    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    rl.on('line', line => {
      const cleanLine = replaceAnsiEscapeCodes(line)
      const diffLine = convertToDiff(cleanLine)

      markdownContent.push(diffLine)

      if (isNumberOfDifferencesString(cleanLine)) {
        numberOfDiffs.push(cleanLine)
      }

      if (containsReplacementPhrase(cleanLine)) {
        numberOfReplacements++
      }
    })

    rl.on('close', async () => {
      const truncatedContent =
        truncateCommentOnPullRequestContent(markdownContent)
      const header = `✨ Number of stacks with differences: ${numberOfDiffs.length}`
      const replacementWarning =
        numberOfReplacements > 0
          ? `⚠️ Number of resources that require replacement: ${numberOfReplacements}\n`
          : ''

      resolve(`${header}\n${replacementWarning}${truncatedContent}`)
    })

    rl.on('error', err => {
      reject(err)
    })
  })
}
