import {
    isNumberOfDifferencesString,
    containsReplacementPhrase,
    replaceAnsiEscapeCodes
} from "../src/transform";

describe('CDK Tests', () => {

    describe('isNumberOfDifferencesString Function', () => {
        it("identifies valid stack difference strings", () => {
            const positiveCases = [
                "Number of stacks with differences: 13",
                "Number of stacks with differences: 9",
                "Number of stacks with differences: 0",
                "Number of stacks with differences: 138"
            ];
            positiveCases.forEach(testCase => {
                expect(isNumberOfDifferencesString(testCase)).toBe(true);
            });
        });

        it("rejects invalid stack difference strings", () => {
            const negativeCases = [
                "This is a random string.",
                "[+] AWS::IAM::Role Custom::VpcRestrictDefaultSGCustomResourceProvider/Role CustomVpcRestrictDefaultSGCustomResourceProviderRole26592FE0",
                "",
                "Number of stack with differences: 10",
                "Number of stacks with difference: 5"
            ];
            negativeCases.forEach(testCase => {
                expect(isNumberOfDifferencesString(testCase)).toBe(false);
            });
        });
    });

    describe('containsReplacementPhrase Function', () => {
        it("identifies strings with replacement phrases", () => {
            const positiveCases = [
                " ├─ [~] CidrBlock (requires replacement)",
                "RouteTableId (may cause replacement)"
            ];
            positiveCases.forEach(testCase => {
                expect(containsReplacementPhrase(testCase)).toBe(true);
            });
        });

        it("rejects strings without replacement phrases", () => {
            const negativeCases = [
                " ├─ [~] CidrBlock (requires replaceme)",
                "This is a random string",
                "",
                "CidrBlock (replacement required)",
                "RouteTableId"
            ];
            negativeCases.forEach(testCase => {
                expect(containsReplacementPhrase(testCase)).toBe(false);
            });
        });
    });

    describe('replaceAnsiEscapeCodes Function', () => {
        it("removes ANSI escape codes from strings", () => {
            const testCases = {
                "\x1b[31mHello\x1b[0m": "Hello",
                "\x1b[1;34mBlue text\x1b[0m": "Blue text",
                "Normal text": "Normal text"
            };
            Object.entries(testCases).forEach(([input, expected]) => {
                expect(replaceAnsiEscapeCodes(input)).toBe(expected);
            });
        });
    });
});