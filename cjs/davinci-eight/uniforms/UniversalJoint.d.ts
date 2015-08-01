import TreeModel = require('../uniforms/TreeModel');
declare class UniversalJoint extends TreeModel {
    theta: number;
    phi: number;
    private modelMatrixVarName;
    constructor(options?: {
        modelMatrixVarName?: string;
    });
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
}
export = UniversalJoint;
