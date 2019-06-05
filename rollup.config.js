import path from 'path'
import replacePlugin from 'rollup-plugin-replace'
import resolvePlugin from 'rollup-plugin-node-resolve'
import babelPlugin from 'rollup-plugin-babel'
import externalsPlugin from 'rollup-plugin-auto-external'

export default [
  {
    input: path.resolve('src/utils/index.js'),
    external: ['./platform', './router'],
    plugins: [
      replacePlugin({
        platform: './platform',
        router: './router'
      }),
      resolvePlugin(),
      babelPlugin({ exclude: 'node_modules/**' }),
      externalsPlugin({ dependencies: true, peerDependecies: true })
    ],
    output: {
      format: 'es',
      dir: 'dist',
      entryFileNames: 'utils.js',
      sourcemap: true
    }
  },
  {
    input: path.resolve('src/platforms/dom/index.js'),
    external: ['react-dom', './utils', './router'],
    plugins: [
      replacePlugin({
        router: './router',
        utils: './utils'
      }),
      resolvePlugin(),
      babelPlugin({ exclude: 'node_modules/**' }),
      externalsPlugin({ dependencies: true, peerDependecies: true })
    ],
    output: {
      format: 'es',
      dir: 'dist',
      entryFileNames: 'platform.js',
      sourcemap: true
    }
  },
  /* {
    input: path.resolve('src/platforms/native/index.js'),
    external: ['react-native', './utils', './router'],
    plugins: [
      replacePlugin({
        router: './router',
        utils: './utils'
      }),
      resolvePlugin(),
      babelPlugin({ exclude: 'node_modules/**' }),
      externalsPlugin({ dependencies: true, peerDependecies: true })
    ],
    output: {
      format: 'es',
      dir: 'dist',
      entryFileNames: 'platform.native.js'
    }
  }, */
  {
    input: path.resolve('src/router/index.js'),
    external: ['./platform', './utils'],
    plugins: [
      replacePlugin({ platform: './platform', utils: './utils' }),
      resolvePlugin(),
      babelPlugin({ exclude: 'node_modules/**' }),
      externalsPlugin({ dependencies: true, peerDependecies: true })
    ],
    output: {
      format: 'es',
      dir: 'dist',
      entryFileNames: 'router.js',
      sourcemap: true
    }
  },
  {
    input: path.resolve('src/index.js'),
    external: ['./platform', './utils', './router'],
    plugins: [
      replacePlugin({
        platform: './platform',
        utils: './utils',
        router: './router'
      }),
      resolvePlugin(),
      babelPlugin({ exclude: 'node_modules/**' }),
      externalsPlugin({ dependencies: true, peerDependecies: true })
    ],
    output: {
      format: 'es',
      dir: 'dist',
      entryFileNames: 'index.js',
      sourcemap: true
    }
  }
]
