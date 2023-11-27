import { truncateCommentOnPullRequestContent } from '../src/github'

describe('GitHub Function Tests', () => {
  describe('truncateCommentOnPullRequestContent', () => {
    it('should return unmodified content for content <= 65,000 characters', () => {
      const shortContent = Array(65000).join('a')
      expect(truncateCommentOnPullRequestContent([shortContent])).toBe(
        shortContent
      )
    })

    it('should handle content exactly 65,000 characters long', () => {
      const boundaryContent = `${Array(65001).join('a')}`
      expect(truncateCommentOnPullRequestContent([boundaryContent])).toBe(
        boundaryContent
      )
    })

    it('should truncate content > 65,000 characters and append truncation message', () => {
      const longContent = `${Array(65002).join('a')}`
      const expected = `${longContent.slice(0, 65000)}\n...truncated`
      expect(truncateCommentOnPullRequestContent([longContent])).toBe(expected)
    })

    it('should return an empty string for empty content', () => {
      expect(truncateCommentOnPullRequestContent([])).toBe('')
    })
  })
})
