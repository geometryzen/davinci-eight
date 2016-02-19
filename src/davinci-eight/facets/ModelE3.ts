import Vector3 from '../math/Vector3';
import Spinor3 from '../math/Spinor3';
import readOnly from '../i18n/readOnly';

'use strict';

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
     * @type {G3m}
     * @private
     */
    private _position = new Vector3().zero();

    /**
     * @property _attitude
     * @type {G3m}
     * @private
     */
    private _attitude = new Spinor3().zero().addScalar(1);

    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     * @property _posCache
     * @type {Vector3}
     * @private
     */
    private _posCache = new Vector3();
    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     * @property _attCache
     * @type {Spinor3}
     * @private
     */
    private _attCache = new Spinor3();
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
     * The <em>attitude</em>, a unitary spinor.
     * </p>
     * @property R
     * @type Spinor3
     * @readOnly
     */
    get R(): Spinor3 {
        return this._attitude
    }
    set R(unused) {
        throw new Error(readOnly(ModelE3.PROP_ATTITUDE).message)
    }
    /**
     * <p>
     * The <em>position</em>, a vector.
     * The vector <b>X</b> designates the center of mass of the body (Physics).
     * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
     * </p>
     *
     * @property X
     * @type Vector3
     * @readOnly
     */
    get X(): Vector3 {
        return this._position
    }
    set X(unused) {
        throw new Error(readOnly(ModelE3.PROP_POSITION).message)
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
                break;
            case ModelE3.PROP_POSITION: {
                return this._posCache.copy(this._position).coords
            }
                break;
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
                this._attitude.copy(this._attCache)
            }
                break;
            case ModelE3.PROP_POSITION: {
                this._posCache.coords = data
                this._position.copy(this._posCache)
            }
                break;
            default: {
                console.warn("ModelE3.setProperty " + name)
            }
        }
        return this;
    }
}
