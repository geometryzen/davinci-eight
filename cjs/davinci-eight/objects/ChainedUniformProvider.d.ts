/// <reference path="../../../src/davinci-eight/renderers/UniformProvider.d.ts" />
declare class ChainedUniformProvider implements UniformProvider {
    private provider;
    private fallback;
    constructor(provider: UniformProvider, fallback: UniformProvider);
    getUniformMatrix3(name: string): {
        transpose: boolean;
        matrix3: Float32Array;
    };
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
}
export = ChainedUniformProvider;
