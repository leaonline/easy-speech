import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/demo.js',
  output: {
    file: 'docs/demo.js',
    format: 'iife',
    name: 'DEMO',
    sourcemap: false
  },
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    terser()
  ]
}
