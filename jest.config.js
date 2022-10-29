/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ["<rootDir>/utils", "<rootDir>Blog", "<rootDir>/app"],
  preset: "ts-jest",
  testEnvironment: "node",
};
