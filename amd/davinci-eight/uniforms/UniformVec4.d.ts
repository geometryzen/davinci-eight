import DefaultUniformProvider = require('../core/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformVariable = require('../uniforms/UniformVariable');
declare class UniformVec4 extends DefaultUniformProvider implements UniformVariable<number[]> {
    private name;
    private $data;
    private $callback;
    private useData;
    private id;
    constructor(name: string, id?: string);
    data: number[];
    callback: () => number[];
    getUniformVector4(name: string): number[];
    getUniformMeta(): UniformMetaInfos;
}
export = UniformVec4;
