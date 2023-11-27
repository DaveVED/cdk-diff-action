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

Welcome to the AWS CDK Diff GitHub Action repository! This project offers a streamlined and automated way to manage infrastructure changes in AWS Cloud Development Kit (CDK) projects, specifically focusing on the cdk diff command. The primary goal of this GitHub Action is to enhance the review process of pull requests by providing a clear, readable, and concise summary of infrastructure changes proposed in each pull request.

## Overview
The AWS CDK Diff GitHub Action automatically runs cdk diff on your AWS CDK projects whenever a pull request is created or updated. It then processes the output of cdk diff, cleans it for readability, and posts it as a comment directly on the pull request. This process provides immediate insights into how the proposed changes will affect your AWS infrastructure, making the review process more informed and efficient.

Most of the template for the action was taken from [here](https://github.com/actions/typescript-action/tree/main) and the general idea taken from [here](https://github.com/karlderkaefer/cdk-notifier), credit to them.

## Key Features
- ***Automated Diff Summary***🤖: Automatically runs cdk diff for pull requests, ensuring that all infrastructure changes are captured and reviewed.
- ***Clean and Clear Output***🧼:  Transforms the raw output of cdk diff into a more readable format by removing unnecessary escape codes and formatting the content in Markdown.
- ***Enhanced Review Process***🔍:  By posting the diff summary directly on the pull request, reviewers can easily understand the impact of the changes without leaving GitHub.
- ***Detection of Critical Changes***⚠️:  Highlights important aspects such as the number of resources that require replacement, aiding in risk assessment and decision-making.
- ***Efficient Output Management***📏:  Ensures the comment size is within GitHub's limits, truncating the content if necessary to fit within the constraints.

## How It Works

The action comprises several key functions:

1. ***Reading and Cleaning Output***: Reads the cdk diff output file, cleans it of ANSI escape codes, and converts it into a Markdown-friendly format.
2. ***Processing Differences***: Identifies the number of stacks with differences and resources requiring replacement, providing a concise summary at the top of the comment.
3. ***Commenting on Pull Requests***: Utilizes the GitHub API to post the processed cdk diff output as a comment on the relevant pull request.