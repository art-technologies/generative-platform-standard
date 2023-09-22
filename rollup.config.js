import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
    input: "src/genps-platform.js",
    output: {
        file: "build/genps-platform.min.mjs",
        format: "es",
    },
    plugins: [
        nodeResolve(),
        terser(),
    ],
};