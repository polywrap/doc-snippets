import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  collectCoverage: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        diagnostics: false
      },
    ],
  },
  setupFilesAfterEnv: ["./jest.setup.ts"],
};

module.exports = jestConfig;