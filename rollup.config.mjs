/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json' assert { type: 'json' };

/**
* Comment with library information to be appended in the generated bundles.
*/
const banner = `/**
* ${pkg.name} ${pkg.version}
* (c) ${pkg.author.name} ${pkg.author.email}
* Released under the ${pkg.license} License.
*/
`.trim();

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: true
            },
            {
                banner,
                file: './dist/system/index.js',
                format: 'system',
                sourcemap: true
            },
            {
                banner,
                file: './dist/system/index.min.js',
                format: 'system',
                sourcemap: true,
                plugins: [terser()]
            }
        ],
        plugins: [
            external(),
            resolve(),
            typescript({ tsconfig: './tsconfig.json' })
        ]
    },
    {
        input: 'dist/esm/types/index.d.ts',
        output: [{ file: pkg.types, format: "esm" }],
        plugins: [dts()],
    }
]