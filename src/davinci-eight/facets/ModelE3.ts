import Geometric3 from '../math/Geometric3'
import Vector3 from '../math/Vector3';
import Spinor3 from '../math/Spinor3';

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
   * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
   * @property _posCache
   * @type {Vector3}
   * @private
   */
  private _posCache: Vector3 = Vector3.zero();

  /**
   * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
   * @property _attCache
   * @type {Spinor3}
   * @private
   */
  private _attCache: Spinor3 = Spinor3.one()

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

  /**
   * @method getProperty
   * @param name {string}
   * @return {number[]}
   */
  getProperty(name: string): number[] {
    switch (name) {
      case ModelE3.PROP_ATTITUDE: {
        return this._attCache.copy(this._attitude).coords
      }
      case ModelE3.PROP_POSITION: {
        return this._posCache.copy(this._position).coords
      }
      default: {
        console.warn("ModelE3.getProperty " + name)
        return void 0
      }
    }
  }

  /**
   * @method setProperty
   * @param name {string}
   * @param data {number[]}
   * @return {ModelE3}
   * @chainable
   */
  setProperty(name: string, data: number[]): ModelE3 {
    switch (name) {
      case ModelE3.PROP_ATTITUDE: {
        this._attCache.coords = data
        this._attitude.copySpinor(this._attCache)
      }
        break;
      case ModelE3.PROP_POSITION: {
        this._posCache.coords = data
        this._position.copyVector(this._posCache)
      }
        break;
      default: {
        console.warn("ModelE3.setProperty " + name)
      }
    }
    return this;
  }
}
