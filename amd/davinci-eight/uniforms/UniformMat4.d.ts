import DefaultUniformProvider = require('../core/DefaultUniformProvider');
import UniformDataInfos = require('../core/UniformDataInfos');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformVariable = require('../uniforms/UniformVariable');
declare class UniformMat4 extends DefaultUniformProvider implements UniformVariable<{
    transpose: boolean;
    matrix4: Float32Array;
}> {
    private $name;
    private $data;
    private $callback;
    private useData;
    private id;
    private $varName;
    constructor(name?: string, id?: string);
    data: {
        transpose: boolean;
        matrix4: Float32Array;
    };
    callback: () => {
        transpose: boolean;
        matrix4: Float32Array;
    };
    private getValue();
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
    getUniformMeta(): UniformMetaInfos;
    getUniformData(): UniformDataInfos;
}
export = UniformMat4;
