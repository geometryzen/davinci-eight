import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Vector3 = require('../math/Vector3');
/**
 * @class EulerModel
 */
declare class EulerModel implements UniformData {
    private _rotation;
    /**
     * @class EulerModel
     * @constructor
     */
    constructor();
    /**
     * @method setUniforms
     * @param visitor {UniformDataVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: UniformDataVisitor, canvasId: number): void;
    /**
     * @property rotation
     * @type {Vector3}
     * @readOnly
     */
    rotation: Vector3;
}
export = EulerModel;
