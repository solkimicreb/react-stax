const path = require("path");
const rollup = require("rollup");
const replacePlugin = require("rollup-plugin-replace");
const resolvePlugin = require("rollup-plugin-node-resolve");
const babelPlugin = require("rollup-plugin-babel");
const externalsPlugin = require("rollup-plugin-auto-external");

const bundles = [
  {
    input: {
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
      ]
    },
    output: [
      {
        format: "es",
        dir: "dist",
        sourcemap: true
      },
      { format: "cjs", dir: "dist", sourcemap: true }
    ]
  }
];

async function build() {
  // Compile source code into a distributable format with Babel and Rollup
  for (const config of bundles) {
    const bundle = await rollup.rollup(config.input);
    await bundle.write(config.output);
  }
}

build();
