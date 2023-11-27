import {
  isNumberOfDifferencesString,
  containsReplacementPhrase,
  replaceAnsiEscapeCodes,
  findDiffSymbol,
  trimLineIfNeeded,
  convertToDiff,
  convertCdkDiffToMarkdown
} from '../src/transform'

describe('Transform Function Tests', () => {
  describe('isNumberOfDifferencesString Function', () => {
    it('should return true for strings correctly formatted as stack difference counts', () => {
      const positiveCases = [
        'Number of stacks with differences: 13',
        'Number of stacks with differences: 9',
        'Number of stacks with differences: 0',
        'Number of stacks with differences: 138'
      ]
      for (const testCase of positiveCases) {
        expect(isNumberOfDifferencesString(testCase)).toBe(true)
      }
    })

    it('should return false for strings not following the stack difference count format', () => {
      const negativeCases = [
        'This is a random string.',
        '[+] AWS::IAM::Role Custom::VpcRestrictDefaultSGCustomResourceProvider/Role CustomVpcRestrictDefaultSGCustomResourceProviderRole26592FE0',
        '',
        'Number of stack with differences: 10',
        'Number of stacks with difference: 5'
      ]
      for (const testCase of negativeCases) {
        expect(isNumberOfDifferencesString(testCase)).toBe(false)
      }
    })
  })

  describe('containsReplacementPhrase Function', () => {
    it('should identify strings containing specific phrases indicating resource replacement', () => {
      const positiveCases = [
        ' ├─ [~] CidrBlock (requires replacement)',
        'RouteTableId (may cause replacement)'
      ]
      for (const testCase of positiveCases) {
        expect(containsReplacementPhrase(testCase)).toBe(true)
      }
    })

    it('should reject strings that do not contain the replacement indicating phrases', () => {
      const negativeCases = [
        ' ├─ [~] CidrBlock (requires replaceme)',
        'This is a random string',
        '',
        'CidrBlock (replacement required)',
        'RouteTableId'
      ]
      for (const testCase of negativeCases) {
        expect(containsReplacementPhrase(testCase)).toBe(false)
      }
    })
  })

  describe('replaceAnsiEscapeCodes Function', () => {
    it('should correctly strip ANSI escape codes from a given string', () => {
      const testCases = {
        '\x1b[31mHello\x1b[0m': 'Hello',
        '\x1b[1;34mBlue text\x1b[0m': 'Blue text',
        'Normal text': 'Normal text'
      }
      for (const [input, expected] of Object.entries(testCases)) {
        expect(replaceAnsiEscapeCodes(input)).toBe(expected)
      }
    })
  })

  describe('findDiffSymbol Function', () => {
    it('should correctly identify and return the diff symbol from a string', () => {
      const positiveCases = ['[+] postive diff', '[-] negative diff', '']
      for (const testCase of positiveCases) {
        expect(['+', '-', '']).toContain(findDiffSymbol(testCase))
      }
    })
  })

  describe('trimLineIfNeeded Function', () => {
    it('should trim the line appropriately based on the presence of a diff symbol', () => {
      const positiveCases = [
        '[+] postive diff',
        '[-] negative diff',
        '',
        'This is a pointless string'
      ]
      expect(trimLineIfNeeded(positiveCases[0], '[')).toBe(positiveCases[0])
      expect(trimLineIfNeeded(positiveCases[1], '[')).toBe(positiveCases[1])
      expect(trimLineIfNeeded(positiveCases[2], '')).toBe(positiveCases[2])
      expect(trimLineIfNeeded(positiveCases[3], 'x')).toBe(
        positiveCases[3].substring(1)
      )
    })
  })

  describe('convertToDiff Function', () => {
    it('should convert a given line of text into a diff format', () => {
      const positiveCases = [
        '[+] postive diff',
        '[-] negative diff',
        '',
        'This is a pointless string'
      ]
      expect(convertToDiff(positiveCases[0])).toBe(`+${positiveCases[0]}`)
      expect(convertToDiff(positiveCases[1])).toBe(`-${positiveCases[1]}`)
      expect(convertToDiff(positiveCases[2])).toBe(positiveCases[2])
      expect(convertToDiff(positiveCases[3])).toBe(positiveCases[3])
    })
  })

  describe('convertCdkDiffToMarkdown Function', () => {
    it('should transform a CDK diff output into Markdown format with stack differences', async () => {
      const response = await convertCdkDiffToMarkdown(
        './test/diff-files/cdk_log_simple_add.log'
      )
      console.log(response)
      expect(response).toMatch(/Number of stacks with differences:/)
    })

    it('should transform a CDK diff output into Markdown format with stack replacements', async () => {
      const response = await convertCdkDiffToMarkdown(
        './test/diff-files/cdk_log_simple_mix.log'
      )
      console.log(response)
      expect(response).toMatch(/Number of stacks with differences:/)
      expect(response).toMatch(/Number of resources that require replacement:/)
    })

    it('should reject if the file does not exist', async () => {
      await expect(
        convertCdkDiffToMarkdown('nonexistent/path/to/file')
      ).rejects.toThrow()
    })
  })
})
