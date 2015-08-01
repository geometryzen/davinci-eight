import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
/**
 * @class TreeModel
 * @extends DefaultUniformProvider
 */
declare class TreeModel extends DefaultUniformProvider {
    private parent;
    private children;
    /**
     * @class Model
     * @constructor
     */
    constructor();
    getParent(): TreeModel;
    setParent(parent: TreeModel): void;
    addChild(child: TreeModel): void;
    removeChild(child: TreeModel): void;
    getUniformVector3(name: string): number[];
    /**
     * @method getUniformMatrix3
     * @param name {string}
     */
    getUniformMatrix3(name: string): {
        transpose: boolean;
        matrix3: Float32Array;
    };
    /**
     * @method getUniformMatrix4
     * @param name {string}
     */
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
    /**
     * @method getUniformMetaInfos
     */
    getUniformMetaInfos(): UniformMetaInfos;
}
export = TreeModel;
