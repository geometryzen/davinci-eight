import {Geometric2} from '../math/Geometric2';
import Vector2 from '../math/Vector2';
import Spinor2 from '../math/Spinor2';

/**
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class ModelE2
 */
export default class ModelE2 {

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

    private _position = new Geometric2().zero();

    private _attitude = new Geometric2().zero().addScalar(1);

    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     *
     * @property _posCache
     * @type {Vector2}
     * @private
     */
    private _posCache = new Vector2();

    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     *
     * @property _attCache
     * @type {Spinor2}
     * @private
     */
    private _attCache = new Spinor2();

    /**
     * <p>
     * A collection of properties for Rigid Body Modeling.
     * </p>
     * <p>
     * ModelE2 implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelE2 at the origin and with unity attitude.
     * </p>
     *
     * @class ModelE2
     * @constructor
     */
    constructor() {
        this._position.modified = true
        this._attitude.modified = true
    }

    /**
     * <p>
     * The <em>attitude</em>, a unitary spinor.
     * </p>
     *
     * @property R
     * @type Geometric2
     */
    get R(): Geometric2 {
        return this._attitude
    }
    set R(attitude: Geometric2) {
      this._attitude.copy(attitude)
    }

    /**
     * <p>
     * The <em>position</em>, a vector.
     * The vector <b>X</b> designates the center of mass of the body (Physics).
     * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
     * </p>
     *
     * @property X
     * @type Geometric2
     */
    get X(): Geometric2 {
        return this._position
    }
    set X(position: Geometric2) {
      this._position.copy(position)
    }

    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[] {
        switch (name) {
            case ModelE2.PROP_ATTITUDE: {
                return this._attCache.copy(this._attitude).coords
            }
            case ModelE2.PROP_POSITION: {
                return this._posCache.copy(this._position).coords
            }
            default: {
                console.warn("ModelE2.getProperty " + name)
                return void 0
            }
        }
    }

    /**
     * @method setProperty
     * @param name {string}
     * @param data {number[]}
     * @return {ModelE2}
     * @chainable
     */
    setProperty(name: string, data: number[]): ModelE2 {
        switch (name) {
            case ModelE2.PROP_ATTITUDE: {
                this._attCache.coords = data
                this._attitude.copySpinor(this._attCache)
            }
                break;
            case ModelE2.PROP_POSITION: {
                this._posCache.coords = data
                this._position.copyVector(this._posCache)
            }
                break;
            default: {
                console.warn("ModelE2.setProperty " + name)
            }
        }
        return this;
    }
}
