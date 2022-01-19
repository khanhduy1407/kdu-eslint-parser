# kdu-eslint-parser

The ESLint custom parser for `.kdu` files.

## ⤴️ Motivation

This parser allows us to lint the `<template>` of `.kdu` files. We can make mistakes easily on `<template>` if we use complex directives and expressions in the template. This parser and the rules of [eslint-plugin-kdu](https://github.com/khanhduy1407/eslint-plugin-kdu) would catch some of the mistakes.

## 💿 Installation

```bash
$ npm install --save-dev eslint kdu-eslint-parser
```

- `kdu-eslint-parser` requires ESLint 3.9.0 or later.

## 📖 Usage

1. Write `parser` option into your `.eslintrc.*` file.
2. Use glob patterns or `--ext .kdu` CLI option.

```json
{
    "extends": "eslint:recommended",
    "parser": "kdu-eslint-parser"
}
```

```console
$ eslint "src/**/*.{js,kdu}"
# or
$ eslint src --ext .kdu
```

## 🔧 Options

`parserOptions` has the same properties as what [espree](https://github.com/eslint/espree#usage), the default parser of ESLint, is supporting.
For example:

```json
{
    "parser": "kdu-eslint-parser",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2022,
        "ecmaFeatures": {
            "globalReturn": false,
            "impliedStrict": false,
            "jsx": false
        }
    }
}
```

### parserOptions.parser

You can use `parserOptions.parser` property to specify a custom parser to parse `<script>` tags.
Other properties than parser would be given to the specified parser.
For example:

```json
{
    "parser": "kdu-eslint-parser",
    "parserOptions": {
        "parser": "babel-eslint",
        "sourceType": "module",
        "allowImportExportEverywhere": false
    }
}
```

```json
{
    "parser": "kdu-eslint-parser",
    "parserOptions": {
        "parser": "typescript-eslint-parser"
    }
}
```

- If you use with `babel-eslint`, use `babel-eslint@>=8.1.1`.
- If you use `typescript-eslint-parser`, the location of original nodes can be wrong. Waiting for `typescript-eslint-parser` to support [parseResult.visitorKeys](https://eslint.org/docs/developer-guide/working-with-plugins#working-with-custom-parsers).

If the `parserOptions.parser` is `false`, the `kdu-eslint-parser` skips parsing `<script>` tags completely.
This is useful for people who use the language ESLint community doesn't provide custom parser implementation.

## 🎇 Usage for custom rules / plugins

- This parser provides `parserServices` to traverse `<template>`.
    - `defineTemplateBodyVisitor(templateVisitor, scriptVisitor)` ... returns ESLint visitor to traverse `<template>`.
    - `getTemplateBodyTokenStore()` ... returns ESLint `TokenStore` to get the tokens of `<template>`.
- [ast.md](./docs/ast.md) is `<template>` AST specification.

## ⚠️ Known Limitations

Some rules make warnings due to the outside of `<script>` tags.
Please disable those rules for `.kdu` files as necessary.

- [eol-last](http://eslint.org/docs/rules/eol-last)
- [linebreak-style](http://eslint.org/docs/rules/linebreak-style)
- [max-len](http://eslint.org/docs/rules/max-len)
- [max-lines](http://eslint.org/docs/rules/max-lines)
- [no-trailing-spaces](http://eslint.org/docs/rules/no-trailing-spaces)
- [unicode-bom](http://eslint.org/docs/rules/unicode-bom)
- Other rules which are using the source code text instead of AST might be confused as well.

### Development Tools

- `npm test` runs tests and measures coverage.
- `npm run build` compiles TypeScript source code to `index.js`, `index.js.map`, and `index.d.ts`.
- `npm run coverage` shows the coverage result of `npm test` command with the default browser.
- `npm run clean` removes the temporary files which are created by `npm test` and `npm run build`.
- `npm run lint` runs ESLint.
- `npm run setup` setups submodules to develop.
- `npm run update-fixtures` updates files in `test/fixtures/ast` directory based on `test/fixtures/ast/*/source.kdu` files.
- `npm run watch` runs `build`, `update-fixtures`, and tests with `--watch` option.
