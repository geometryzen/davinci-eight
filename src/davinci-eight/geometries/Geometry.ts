import Cartesian3 = require('../math/Cartesian3')
import mustBeObject = require('../checks/mustBeObject')
import Vector3 = require('../math/Vector3')

/**
 * @class Geometry
 */
class Geometry {
  /**
   * @property _position
   * @type {Vector3}
   * @private
   */
  private _position = new Vector3();
  /**
   * @property useTextureCoords
   * @type {boolean}
   */
  public useTextureCoords: boolean = false
  /**
   * @class Geometry
   * @constructor
   */
  constructor() {
  }
  /**
   * <p>
   * The local `position` property used for geometry generation.
   * </p>
   * @property position
   * @type {Cartesian3}
   */
  get position(): Cartesian3 {
    return this._position
  }
  set position(position: Cartesian3) {
    mustBeObject('position', position)
    this._position.copy(position)
  }
}

export = Geometry