import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformVariable = require('../uniforms/UniformVariable');
declare class UniformFloat extends DefaultUniformProvider implements UniformVariable<number> {
    private name;
    private $value;
    private $callback;
    private useValue;
    private id;
    constructor(name: string, id?: string);
    value: number;
    callback: () => number;
    getUniformFloat(name: string): number;
    getUniformMetaInfos(): UniformMetaInfos;
}
export = UniformFloat;
