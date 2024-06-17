import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import peer_deps_external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json' assert { type: 'json' };

function non_minified_file(path: string): string {
    return path.replace(".min.js", ".js");
}

/**
* Comment with library information to be appended in the generated bundles.
*/
const banner = `/**
* ${pkg.name} ${pkg.version}
* (c) ${pkg.author.name} ${pkg.author.email}
* Released under the ${pkg.license} License.
*/
`.trim();

const options: RollupOptions[] = [
    {
        input: 'src/index.ts',
        output: [
            {
                file: non_minified_file(pkg.exports['.'].import),
                format: 'esm',
                sourcemap: true
            },
            {
                file: pkg.exports['.'].import,
                format: 'esm',
                sourcemap: true,
                plugins: [terser()]
            },
            {
                banner,
                file: non_minified_file(pkg.exports['.'].system),
                format: 'system',
                sourcemap: true
            },
            {
                banner,
                file: pkg.exports['.'].system,
                format: 'system',
                sourcemap: true,
                plugins: [terser()]
            },
            {
                banner,
                file: pkg.exports['.'].require,
                format: 'commonjs',
                sourcemap: true
            },
            {
                file: pkg.browser,
                format: 'umd',
                name: 'EIGHT',
                sourcemap: true
            }
        ],
        plugins: [
            // Allows us to consume libraries that are CommonJS.
            commonjs(),
            peer_deps_external() as Plugin,
            resolve(),
            typescript({ tsconfig: './tsconfig.json', exclude: ['**/*.spec.ts'], noEmitOnError: true })
        ]
    },
    {
        input: 'dist/esm/types/src/index.d.ts',
        output: [{ file: pkg.types, format: "esm" }],
        plugins: [dts()],
    }
];

export default options;