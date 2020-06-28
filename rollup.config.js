import pkg from './package.json';

export default [
    // browser-friendly UMD build
    {
        input: './build/module/index.js',
        output: {
            name: 'EIGHT',
            file: pkg.browser,
            format: 'umd',
            globals: {
                tslib: 'tslib'
            }
        },
        external: ['tslib']
    }
];