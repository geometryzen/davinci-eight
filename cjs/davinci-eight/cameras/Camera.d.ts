/// <reference path="../../../src/davinci-eight/renderers/UniformProvider.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/UniformMetaInfo.d.ts" />
import Matrix4 = require('../math/Matrix4');
declare class Camera implements UniformProvider {
    projectionMatrix: Matrix4;
    constructor(spec?: any);
    getUniformMatrix3(name: string): any;
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
    static getUniformMetaInfo(): UniformMetaInfo;
}
export = Camera;
