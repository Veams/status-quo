module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    plugins: ['react', '@typescript-eslint', 'simple-import-sort'],
    ignorePatterns: [
        '.eslintrc.js',
        '*.config.js',
        'setupTests.js',
        'setupTests.ts',
        'env.js',
        'env.local.js',
    ],
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
        'plugin:react/recommended',
        'airbnb',
        'airbnb/hooks',
        'airbnb-typescript',
        // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors.
        // Make sure this is always the last configuration in the extends array.
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    settings: {
        react: {
            version: 'detect', // React version. "detect" automatically picks the version you have installed.
        },
    },
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    rules: {
        'max-classes-per-file': ['error', 2],
        'no-console': 'off',
        '@typescript-eslint/consistent-type-imports': 'error',
        'no-param-reassign': ['error', {props: false}], // for reducer and simple reference changes
        'import/order': 'off', // Is handled by simple-import-sort
        'import/prefer-default-export': 'off', // This is not really useful, because named exports are easier to import (IDE)
        'import/no-default-export': 'error', // Prefer named exports over default exports since they are easier to find and refactor
        'import/extensions': [
            'error',
            'always',
            {
                ignorePackages: true,
                js: 'always',
            },
        ],
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': [
            'error',
            {
                /**
                 * The default grouping, but with type imports last as a separate group.
                 * From https://github.com/lydell/eslint-plugin-simple-import-sort/blob/37f9448cdfed85dacf27e34c515653ff96f0377a/examples/.eslintrc.js.
                 */
                groups: [['^\\u0000'], ['^@?\\w'], ['^'], ['^\\.'], ['^.+\\u0000$']],
            },
        ],
        '@typescript-eslint/no-use-before-define': ['error', {functions: false}], // function declarations are always
        // hoisted so it's safe
        '@typescript-eslint/lines-between-class-members': [
            'error',
            'always',
            {exceptAfterSingleLine: true},
        ], // Avoid blowing up classes

        // Forbid the use of extraneous packages
        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
        // paths are treated both as absolute paths, and relative to process.cwd()
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    '**/setupTests.{js,ts}', // test setup files
                    'test/**', // tape, common npm pattern
                    'tests/**', // also common npm pattern
                    'spec/**', // mocha, rspec-like pattern
                    '**/__tests__/**', // jest pattern
                    '**/__mocks__/**', // jest pattern
                    'test.{js,jsx}', // repos with a single test file
                    'test-*.{js,jsx}', // repos with multiple top-level test files
                    '**/*{.,_}{test,spec}.{js,jsx}', // tests where the extension or filename suffix denotes that it is a test
                    '**/jest.config.js', // jest config
                    '**/jest.setup.js', // jest setup
                    '**/vue.config.js', // vue-cli config
                    '**/webpack.config.js', // webpack config
                    '**/webpack.config.*.js', // webpack config
                    '**/rollup.config.js', // rollup config
                    '**/rollup.config.*.js', // rollup config
                    '**/gulpfile.js', // gulp config
                    '**/gulpfile.*.js', // gulp config
                    '**/Gruntfile{,.js}', // grunt config
                    '**/protractor.conf.js', // protractor config
                    '**/protractor.conf.*.js', // protractor config
                    '**/karma.conf.js', // karma config
                    '**/.eslintrc.js', // eslint config
                ],
                optionalDependencies: false,
            },
        ],
        'react/prop-types': 'off', // Since we do not use prop-types
        'react/require-default-props': 'off', // Since we do not use prop-types
        // Many of our loops are server side rendered, so we can rely on the index in general
        'react/no-array-index-key': 0,
        // To support hydration of components, a string is necessary so that the minification of bundles
        // do not affect our markup generation on the server.
        'react/display-name': [2, {ignoreTranspilerName: true}],
        // aria roles ignored (0) instead of warning (1) / errors (2).
        'jsx-a11y/role-supports-aria-props': 0,
        'react/function-component-definition': [2, {namedComponents: 'arrow-function'}],
        // Conditional spreads are easier to do so we can deactivate this rule
        'react/jsx-props-no-spreading': 0,
        // Enforce the definition of Fragment instead of shorthand syntax.
        // The thing is, that keys can only be applied to the long version. So we should stick to one version.
        'react/jsx-fragments': [2, 'element'],
        // We need to use setDangerouslyInnerHtml for article and server side rendered markup prepared by external helpers.
        // So it makes no sense to have this rule in place.
        'react/no-danger': 0,
        // strict null-checking is not necessary.
        // The syntax itself should be avoided for sure but in some cases where we know we get the data,
        // we can use this functionality
        '@typescript-eslint/no-non-null-assertion': 0,
    },
};
