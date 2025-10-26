module.exports = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts', '**/*.tests.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coveragePathIgnorePatterns: [
        '/presentation/controllers/protocols/',
        '/presentation/protocols/index.ts',
    ],
    transform: {
        '.+\\.ts$': 'ts-jest',
    },
};
