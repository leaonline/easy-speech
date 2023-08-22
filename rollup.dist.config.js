import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'

export default [{
  input: 'src/EasySpeech.js',
  output: [
    {
      file: 'dist/EasySpeech.js',
      format: 'es'
    },
    {
      file: 'dist/EasySpeech.es5.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })]
    },
    {
      file: 'dist/EasySpeech.cjs.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })]
    }
  ]
}, {
  input: 'src/EasySpeech.js',
  output: {
    file: 'dist/EasySpeech.iife.js',
    format: 'iife',
    name: 'EasySpeech'
  },
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    copy({
      targets: [
        { src: 'src/index.d.ts', dest: 'dist/index.d.ts' },
      ]
    })
  ]
}]
