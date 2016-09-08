import {Geometric3} from '../math/Geometric3'

/**
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class ModelE3
 */
export default class ModelE3 {

  /**
   * The name of the property that designates the attitude.
   * @property PROP_ATTITUDE
   * @type {string}
   * @default 'R'
   * @static
   * @readOnly
   */
  public static PROP_ATTITUDE = 'R';

  /**
   * The name of the property that designates the position.
   * @property PROP_POSITION
   * @type {string}
   * @default 'X'
   * @static
   * @readOnly
   */
  public static PROP_POSITION = 'X';

  /**
   * @property _position
   * @type {Geometric3}
   * @private
   */
  private _position = Geometric3.zero();

  /**
   * @property _attitude
   * @type {Geometric3}
   * @private
   */
  private _attitude: Geometric3 = Geometric3.one()

  /**
   * <p>
   * A collection of properties for Rigid Body Modeling.
   * </p>
   * <p>
   * ModelE3 implements Facet required for manipulating a composite object.
   * </p>
   * <p>
   * Constructs a ModelE3 at the origin and with unity attitude.
   * </p>
   * @class ModelE3
   * @constructor
   */
  constructor() {
    this._position.modified = true
    this._attitude.modified = true
  }

  /**
   * <p>
   * The <em>attitude</em>, a rotor.
   * </p>
   *
   * @property R
   * @type Geometric3
   */
  get R(): Geometric3 {
    return this._attitude
  }
  set R(attitude: Geometric3) {
    this._attitude.copySpinor(attitude)
  }

  /**
   * <p>
   * The <em>position</em>, a vector.
   * </p>
   * @property X
   * @type Geometric3
   */
  get X(): Geometric3 {
    return this._position
  }
  set X(position: Geometric3) {
    this._position.copyVector(position)
  }
}
