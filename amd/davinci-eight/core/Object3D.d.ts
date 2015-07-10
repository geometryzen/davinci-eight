import Vector3 = require('../math/Vector3');
import Spinor3 = require('../math/Spinor3');
/**
 * @class Object3D
 */
declare class Object3D {
    private _parent;
    children: Object3D[];
    position: Vector3;
    attitude: Spinor3;
    /**
     * @constructor
     */
    constructor();
    parent: Object3D;
    /**
     * Translate the object by distance along an axis in object space. The axis is assumed to be normalized.
     * @method translateOnAxis
     * @param axis {Vector3}
     * @param distance {Number}
     */
    translateOnAxis(axis: Vector3, distance: number): Object3D;
}
export = Object3D;
