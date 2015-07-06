/// <reference path="../../../src/davinci-eight/renderers/UniformProvider.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/UniformMetaInfo.d.ts" />
/// <reference path="../../../src/davinci-eight/core/Drawable.d.ts" />
import Matrix4 = require('../math/Matrix4');
declare class Camera implements UniformProvider, Drawable {
    projectionMatrix: Matrix4;
    private fakeHasContext;
    constructor(spec?: any);
    getUniformMatrix3(name: string): any;
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
    drawGroupName: string;
    useProgram(context: WebGLRenderingContext): void;
    draw(context: WebGLRenderingContext, time: number, uniformProvider: UniformProvider): void;
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, contextId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
    static getUniformMetaInfo(): UniformMetaInfo;
}
export = Camera;
