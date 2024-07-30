// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    trailingComma: 'none',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    printWidth: 80,
    overrides: [
        {
            files: 'src/colors/colorbrewer.js',
            options: {
                printWidth: 160
            }
        },
        {
            files: 'test/*.js',
            options: {
                printWidth: 160
            }
        }
    ]
};

export default config;
