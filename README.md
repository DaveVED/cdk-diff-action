# AWS CDK Diff GitHub Action

<p align="center">
  <!-- First Row - TypeScript Badge -->
  <a href="https://github.com/Envoy-VC/awesome-badges">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript"/>
  </a>
</p>

<p align="center">
  <!-- Second Row - Other Badges -->
  <a href="https://github.com/daveved/cdk-diff-action/actions/workflows/ci.yml">
    <img src="https://github.com/daveved/cdk-diff-action/actions/workflows/ci.yml/badge.svg" alt="continuous integration"/>
  </a>
  <a href="./badges/coverage.svg">
    <img src="./badges/coverage.svg" alt="coverage"/>
  </a>
  <a href="https://github.com/daveved/cdk-diff-action/actions/workflows/linter.yml">
    <img src="https://github.com/daveved/cdk-diff-action/actions/workflows/linter.yml/badge.svg" alt="lint code base"/>
  </a>
  <a href="https://github.com/daveved/cdk-diff-action/actions/workflows/codeql-analysis.yml">
    <img src="https://github.com/daveved/cdk-diff-action/actions/workflows/codeql-analysis.yml/badge.svg" alt="codeql"/>
  </a>
  <a href="https://github.com/daveved/cdk-diff-action/actions/workflows/check-dist.yml">
    <img src="https://github.com/daveved/cdk-diff-action/actions/workflows/check-dist.yml/badge.svg" alt="check dist/"/>
  </a>
</p>

Welcome to the AWS CDK Diff GitHub Action repository! This GitHub Action automates the process of reviewing infrastructure changes in AWS Cloud Development Kit (CDK) projects by using the cdk diff command. It aims to enhance pull request reviews by providing a clear and concise summary of proposed infrastructure changes.

## Overview

This action runs cdk diff on AWS CDK projects for each pull request, processes the output for readability, and posts it as a comment on the pull request. This facilitates informed and efficient review processes by providing immediate insights into the impact of proposed changes on AWS infrastructure.

Most of the template for the action was taken from [here](https://github.com/actions/typescript-action/tree/main) and the general idea taken from [here](https://github.com/karlderkaefer/cdk-notifier), credit to them.

## Usage

Refer to the [actions.yml](https://github.com/DaveVED/cdk-diff-action/blob/main/action.yml)for detailed configuration options.

### Basic Configuration

```yaml
- uses: daveved/cdk-diff-action@v1
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```

### Basic

```yml
- uses: daveved/cdk-diff-action@v1
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```

### Referencing the Output

```yml
- name: Use My Action
  id: myaction # Assign an ID to the step to reference its outputs
  uses: daveved/cdk-diff-action@v1
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}

# Example of using the output from the above step
- name: Use Output
  run: echo "The output was ${{ steps.myaction.outputs.outputPath }}"
```

### Dependencies

For **version 1** your CI needs to be setup with your AWS credentails, and the cdk. This might change in future, but for now, you need to have this done befor you call the `cdk-diff-action`.

```yml
- uses: actions/checkout@v4

- uses: actions/setup-python@v4
  with:
    python-version: "3.9"

- uses: actions/setup-node@v4
  with:
    node-version: '20'

- run: npm ci

- run: |
    python -m pip install --upgrade pip
    npm install -g aws-cdk

- uses: aws-actions/configure-aws-credentials@master
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_KEY }}
    aws-region: "us-east-1"

- uses: daveved/cdk-diff-action@v1
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## Key Features

- **_Automated Diff Summary_**🤖: Automatically runs cdk diff for pull requests, ensuring that all infrastructure changes are captured and reviewed.
- **_Clean and Clear Output_**🧼: Transforms the raw output of cdk diff into a more readable format by removing unnecessary escape codes and formatting the content in Markdown.
- **_Enhanced Review Process_**🔍: By posting the diff summary directly on the pull request, reviewers can easily understand the impact of the changes without leaving GitHub.
- **_Detection of Critical Changes_**⚠️: Highlights important aspects such as the number of resources that require replacement, aiding in risk assessment and decision-making.
- **_Efficient Output Management_**📏: Ensures the comment size is within GitHub's limits, truncating the content if necessary to fit within the constraints.

## How It Works

The action comprises several key functions:

1. **_Reading and Cleaning Output_**: Reads the cdk diff output file, cleans it of ANSI escape codes, and converts it into a Markdown-friendly format.
2. **_Processing Differences_**: Identifies the number of stacks with differences and resources requiring replacement, providing a concise summary at the top of the comment.
3. **_Commenting on Pull Requests_**: Utilizes the GitHub API to post the processed cdk diff output as a comment on the relevant pull request.
