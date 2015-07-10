import Vector3 = require('../math/Vector3');
import Spinor3 = require('../math/Spinor3');

/**
 * Temporary vector used in calculations.
 */
var v1 = new Vector3();

/**
 * @class Object3D
 */
class Object3D {
  private _parent: Object3D;
  public children: Object3D[];
  public position: Vector3;
  public attitude: Spinor3;
  /**
   * @constructor
   */
  constructor() {
    /**
     * Object's parent in the tree of objects.
     * @property parent
     * @type [Object3D]
     * @default null
     */
    this._parent = null;
    /**
     * Array with Object's children.
     * @property children
     * @type Object3D[]
     * @default []
     */
    this.children = [];
    /**
     * Object's local position.
     * @property position
     * @type Vector3
     * @default Vector3()
     */
    this.position = new Vector3();
    /**
     * Object's local attitude.
     * @property attitude
     * @type Spinor3
     * @default Spinor3()
     */
    this.attitude = new Spinor3();
  }
  get parent() {
    return this._parent;
  }
  /**
   * Translate the object by distance along an axis in object space. The axis is assumed to be normalized.
   * @method translateOnAxis
   * @param axis {Vector3}
   * @param distance {Number}
   */
  translateOnAxis(axis: Vector3, distance: number): Object3D {
    v1.copy(axis).applySpinor(this.attitude);
    this.position.add(v1.multiplyScalar(distance));
    return this;
  }
}

export = Object3D;
