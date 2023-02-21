import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/bundle.es5.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })]
    },
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })]
    },
    {
      file: 'dist/bundle.iife.js',
      format: 'iife',
      name: 'EasySpeech'
    }
  ],
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
  ]
}
