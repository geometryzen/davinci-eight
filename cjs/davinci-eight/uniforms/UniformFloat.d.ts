import DefaultUniformProvider = require('../core/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformVariable = require('../uniforms/UniformVariable');
/**
 * @class UniformFloat
 */
declare class UniformFloat extends DefaultUniformProvider implements UniformVariable<number> {
    private name;
    private $data;
    private $callback;
    private useData;
    private useCallback;
    private id;
    /**
     * @class UniformFloat
     * @constructor
     * @param name {string}
     * @param name {id}
     */
    constructor(name: string, id?: string);
    data: number;
    callback: () => number;
    getUniformFloat(name: string): number;
    getUniformMeta(): UniformMetaInfos;
}
export = UniformFloat;
