import { convertToMarkdown } from "../src/transform";

describe('CDK Tests', ( )=> {
    it("should convert a simple file to markdown", async () => {
        const markdown = await convertToMarkdown("./test/diff-files/cdk_log_simple_mix.log");
        console.log(markdown);
    })
})
