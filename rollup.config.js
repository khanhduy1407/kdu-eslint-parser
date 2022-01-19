import resolve from "rollup-plugin-node-resolve"
import sourcemaps from "rollup-plugin-sourcemaps"

const pkg = require("./package.json")
const deps = new Set(
    [
        "assert",
        "events",
        "path",
    ].concat(Object.keys(pkg.dependencies))
)

export default {
    input: ".temp/index.js",
    output: {
        file: "index.js",
        format: "cjs",
        sourcemap: true,
        sourcemapFile: "index.js.map",
        strict: true,
    },
    plugins: [
        sourcemaps(),
        resolve(),
    ],
    external: (id) => deps.has(id) || id.startsWith("lodash"),
    banner: `/**
 * @author NKDuy <https://github.com/khanhduy1407>
 * @copyright 2022 NKDuy. All rights reserved.
 * See LICENSE file in root directory for full license.
 */`,
}
