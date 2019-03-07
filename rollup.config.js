import pkg from './package.json';

const rollupBabel = require('rollup-plugin-babel');

const LIB_NAME = 'p5-react-renderer';

export default {
  input: 'src/index.js',
  output: [
    {
      name: LIB_NAME,
      file: pkg.main,
      format: 'cjs',
    },
    {
      name: LIB_NAME,
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    rollupBabel({
      exclude: '**/node_modules/**',
      babelrc: true,
      runtimeHelpers: false,
    }),
  ],
};
