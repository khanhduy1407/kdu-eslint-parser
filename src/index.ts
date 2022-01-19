import * as path from "path"
import * as AST from "./ast"
import { LocationCalculator } from "./common/location-calculator"
import { HTMLParser, HTMLTokenizer } from "./html"
import { parseScript, parseScriptElement } from "./script"
import * as services from "./parser-services"

const STARTS_WITH_LT = /^\s*</

/**
 * Check whether the code is a Kdu.js component.
 * @param code The source code to check.
 * @param options The parser options.
 * @returns `true` if the source code is a Kdu.js component.
 */
function isKduFile(code: string, options: any): boolean {
    const filePath = (options.filePath as string | undefined) || "unknown.js"
    return path.extname(filePath) === ".kdu" || STARTS_WITH_LT.test(code)
}

/**
 * Check whether the node is a `<template>` element.
 * @param node The node to check.
 * @returns `true` if the node is a `<template>` element.
 */
function isTemplateElement(node: AST.VNode): node is AST.VElement {
    return node.type === "VElement" && node.name === "template"
}

/**
 * Check whether the node is a `<script>` element.
 * @param node The node to check.
 * @returns `true` if the node is a `<script>` element.
 */
function isScriptElement(node: AST.VNode): node is AST.VElement {
    return node.type === "VElement" && node.name === "script"
}

/**
 * Check whether the attribute node is a `lang` attribute.
 * @param attribute The attribute node to check.
 * @returns `true` if the attribute node is a `lang` attribute.
 */
function isLang(attribute: AST.VAttribute | AST.VDirective): attribute is AST.VAttribute {
    return attribute.directive === false && attribute.key.name === "lang"
}

/**
 * Parse the given source code.
 * @param code The source code to parse.
 * @param options The parser options.
 * @returns The parsing result.
 */
export function parseForESLint(code: string, options: any): AST.ESLintExtendedProgram {
    options = Object.assign({
        comment: true,
        ecmaVersion: 2015,
        loc: true,
        range: true,
        tokens: true,
    }, options || {})

    let result: AST.ESLintExtendedProgram
    if (!isKduFile(code, options)) {
        result = parseScript(code, options)
    }
    else {
        const tokenizer = new HTMLTokenizer(code)
        const rootAST = new HTMLParser(tokenizer, options).parse()
        const locationCalcurator = new LocationCalculator(tokenizer.gaps, tokenizer.lineTerminators)
        const script = rootAST.children.find(isScriptElement)
        const template = rootAST.children.find(isTemplateElement)
        const templateLangAttr = template && template.startTag.attributes.find(isLang)
        const templateLang = (templateLangAttr && templateLangAttr.value && templateLangAttr.value.value) || "html"
        const concreteInfo: AST.HasConcreteInfo = {
            tokens: rootAST.tokens,
            comments: rootAST.comments,
            errors: rootAST.errors,
        }

        result = (script != null)
            ? parseScriptElement(script, locationCalcurator, options)
            : parseScript("", options)
        result.ast.templateBody = (template != null && templateLang === "html")
            ? Object.assign(template, concreteInfo)
            : undefined
    }

    result.services = Object.assign(result.services || {}, services.define(result.ast))

    return result
}

/**
 * Parse the given source code.
 * @param code The source code to parse.
 * @param options The parser options.
 * @returns The parsing result.
 */
export function parse(code: string, options: any): AST.ESLintProgram {
    return parseForESLint(code, options).ast
}

export { AST }