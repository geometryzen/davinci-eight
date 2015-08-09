import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformVariable = require('../uniforms/UniformVariable');
declare class UniformVec3 extends DefaultUniformProvider implements UniformVariable<number[]> {
    private $name;
    private $data;
    private $callback;
    private useData;
    private useCallback;
    private id;
    private $varName;
    constructor(name: string, id?: string);
    data: number[];
    callback: () => number[];
    getUniformVector3(name: string): number[];
    getUniformMeta(): UniformMetaInfos;
}
export = UniformVec3;
