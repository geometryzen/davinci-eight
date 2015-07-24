import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformVariable = require('../uniforms/UniformVariable');
declare class UniformVec4 extends DefaultUniformProvider implements UniformVariable<number[]> {
    private name;
    private $value;
    private $callback;
    private useValue;
    private id;
    constructor(name: string, id?: string);
    value: number[];
    callback: () => number[];
    getUniformVector4(name: string): number[];
    getUniformMetaInfos(): UniformMetaInfos;
}
export = UniformVec4;
