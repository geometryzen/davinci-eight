import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import Spinor3 = require('../math/Spinor3');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import Color = require('../core/Color');
/**
 * @class LocalModel
 * @extends DefaultUniformProvider
 */
declare class LocalModel extends DefaultUniformProvider {
    /**
     * @property position
     * @type Vector3
     */
    position: Vector3;
    /**
     * @property attitude
     * @type Spinor3Coords
     */
    attitude: Spinor3;
    /**
     *
     */
    private uColor;
    /**
     * @class Model
     * @constructor
     */
    constructor();
    color: Color;
    /**
     * @method getUniformVector3
     * @param name {string}
     */
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
     * @method getUniformMeta
     */
    getUniformMeta(): UniformMetaInfos;
}
export = LocalModel;
