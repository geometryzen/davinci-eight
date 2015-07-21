import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import Spinor3Coords = require('../math/Spinor3Coords');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @class ModelMatrixUniformProvider
 * @extends DefaultUniformProvider
 */
declare class ModelMatrixUniformProvider extends DefaultUniformProvider {
    /**
     * @property position
     * @type Cartesian3
     */
    position: Cartesian3;
    /**
     * @property attitude
     * @type Spinor3Coords
     */
    attitude: Spinor3Coords;
    /**
     * @class Model
     * @constructor
     */
    constructor();
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
    static getUniformMetaInfos(): UniformMetaInfos;
}
export = ModelMatrixUniformProvider;
