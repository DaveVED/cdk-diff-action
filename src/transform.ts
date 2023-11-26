import * as fs from 'fs';
import * as readline from 'readline';

const REGEX_NUMBER_OF_DIFFERENCES_STRING = /Number of stacks with differences:.*/;
const REGEX_ANSI_ESCAPE_CODES = /\x1b\[[0-9;]*m/g;
const REGEX_REQUIRES_REPLACEMENT = /\(requires replacement\)|\(may cause replacement\)/;

export const isNumberOfDifferencesString = (input: string): boolean => {
    return REGEX_NUMBER_OF_DIFFERENCES_STRING.test(input);
}

export const replaceAnsiEscapeCodes = (input: string): string => {
    return input.replace(REGEX_ANSI_ESCAPE_CODES, "");
}

export const containsReplacementPhrase = (input: string): boolean => {
    return REGEX_REQUIRES_REPLACEMENT.test(input);
}

export const convertToDiff = (line: string): string => {
    const regex = /(?:\[(\+|-+)\])|(?:│\s(\+|-)\s│)/;
    const matches = line.match(regex);

    let foundSymbol = '';
    if (matches) {
        for (let i = 1; i < matches.length; i++) {
            const match = matches[i];
            if (match) {
                foundSymbol = match;
                // No logging as per your request
                break; // Break as we found the symbol
            }
        }
    }

    let modifiedLine = line;
    if (foundSymbol !== '') {
        if (!line.startsWith('[')) {
            modifiedLine = modifiedLine.substring(1); // Trim the first character if it's not '['
        }
        modifiedLine = foundSymbol + modifiedLine;
    }

    return modifiedLine;
};

export const convertToMarkdown = async (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        let markdownContent: string[] = [];
        let numberOfDiffs: string[] = [];
        let numberOfReplacements: number = 0;

        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            const cleanLine = replaceAnsiEscapeCodes(line);
            const diffLine = convertToDiff(cleanLine);

            // Append processed line to markdown content
            markdownContent.push(diffLine);

            // Check for number of differences
            if (isNumberOfDifferencesString(cleanLine)) {
                numberOfDiffs.push(cleanLine);
            }

            if (containsReplacementPhrase(cleanLine)) {
                numberOfReplacements++;
            }
        });

        rl.on('close', async () => {
            // Truncate if content is too long
            let truncatedContent = markdownContent.join('\n');
            if (truncatedContent.length > 65000) {
                truncatedContent = truncatedContent.slice(0, 65000) + "\n...truncated";
            }

            const markdownDiff = '```diff\n' + truncatedContent + '\n```';
            const header = `✨ Number of stacks with differences: ${numberOfDiffs.length}`;

            // If you want to include the replacement warning
            const replacementWarning = numberOfReplacements > 0 ? `⚠️ Number of resources that require replacement: ${numberOfReplacements}\n` : '';

            // Combine header, replacement warning (if any), and diff content
            resolve(`${header}\n${replacementWarning}${markdownDiff}`);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}