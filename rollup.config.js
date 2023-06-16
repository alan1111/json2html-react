import clear from 'rollup-plugin-clear';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: ['./utils/main.js'],
  output: [
    {
      file: 'dist/cjs.js',
      format: 'cjs',
      name: 'cjs.js',
    },
    {
      file: 'dist/umd.js',
      format: 'umd',
      name: 'umd.js',
    },
    {
      file: 'dist/esm.js',
      format: 'es',
      name: 'esm.js',
    },
  ],
  plugins: [
    clear({
      targets: ['web-react'],
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      presets: ['@babel/env', '@babel/preset-react']
    }),
    commonjs(),
    terser(),
    uglify(),
  ],
  external: ['react', 'react-dom', 'react-form-validates'],
};
