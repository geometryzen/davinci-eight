import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformVariable = require('../uniforms/UniformVariable');
declare class UniformMat4 extends DefaultUniformProvider implements UniformVariable<{
    transpose: boolean;
    matrix4: Float32Array;
}> {
    private name;
    private $data;
    private $callback;
    private useData;
    private id;
    constructor(name: string, id?: string);
    data: {
        transpose: boolean;
        matrix4: Float32Array;
    };
    callback: () => {
        transpose: boolean;
        matrix4: Float32Array;
    };
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
    getUniformMetaInfos(): UniformMetaInfos;
}
export = UniformMat4;
