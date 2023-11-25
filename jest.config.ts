import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  roots: ["<rootDir>/test"],
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  transform: {
      "^.+\\.tsx?$": "ts-jest"
  },
  collectCoverage: true,
  coverageReporters: ["text"]
};

export default config