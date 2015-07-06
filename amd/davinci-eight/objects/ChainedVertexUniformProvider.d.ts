/// <reference path="../../../src/davinci-eight/renderers/VertexUniformProvider.d.ts" />
declare class ChainedVertexUniformProvider implements VertexUniformProvider {
    private provider;
    private fallback;
    constructor(provider: VertexUniformProvider, fallback: VertexUniformProvider);
    getUniformMatrix3(name: string): {
        transpose: boolean;
        matrix3: Float32Array;
    };
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
}
export = ChainedVertexUniformProvider;
