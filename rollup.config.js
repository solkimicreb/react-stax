import path from "path";
import replacePlugin from "rollup-plugin-replace";
import resolvePlugin from "rollup-plugin-node-resolve";
import babelPlugin from "rollup-plugin-babel";
import externalsPlugin from "rollup-plugin-auto-external";

export default {
  input: {
    dom: path.resolve("src/index.dom.js"),
    node: path.resolve("src/index.node.js"),
    sandbox: path.resolve("src/index.sandbox.js")
  },
  external: ["./react-platform"],
  plugins: [
    replacePlugin({ "react-platform": "./react-platform" }),
    resolvePlugin(),
    babelPlugin({ exclude: "node_modules/**" }),
    externalsPlugin({ dependencies: true, peerDependecies: true })
  ],
  output: [
    {
      format: "es",
      dir: "dist",
      chunkFileNames: "[name].[format].js",
      entryFileNames: "[name].[format].js",
      sourcemap: true
    },
    {
      format: "cjs",
      dir: "dist",
      chunkFileNames: "[name].[format].js",
      entryFileNames: "[name].[format].js",
      sourcemap: true
    }
  ]
};
