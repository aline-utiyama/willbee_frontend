const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Handle absolute imports (e.g., @/components -> ./components)
    "^@/(.*)$": "<rootDir>/src/$1",
    // Handle D3 imports
    "d3": "<rootDir>/node_modules/d3/dist/d3.min.js",
    "^d3-(.*)$": "<rootDir>/node_modules/d3-$1/dist/d3-$1.min.js"
  },
  transform: {
    // Transform ES Modules
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: ["/node_modules/(?!(d3)/)"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
