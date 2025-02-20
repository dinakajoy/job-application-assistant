export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  testTimeout: 30000,
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
