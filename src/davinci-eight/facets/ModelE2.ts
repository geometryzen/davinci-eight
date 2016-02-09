import IAnimationTarget from '../slideshow/IAnimationTarget';
import mustBeString from '../checks/mustBeString';
import G2 from '../math/G2';
import R2 from '../math/R2';
import SpinG2 from '../math/SpinG2';
import readOnly from '../i18n/readOnly';
import Shareable from '../core/Shareable';

/**
 * @module EIGHT
 * @submodule facets
 */

/**
 * @class ModelE2
 */
export default class ModelE2 extends Shareable implements IAnimationTarget {
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

    private _position = new G2().zero();
    private _attitude = new G2().zero().addScalar(1);
    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     * @property _posCache
     * @type {R2}
     * @private
     */
    private _posCache = new R2();
    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     * @property _attCache
     * @type {SpinG2}
     * @private
     */
    private _attCache = new SpinG2();
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
     * @class ModelE2
     * @constructor
     * @param type [string = 'ModelE2'] The name used for reference counting.
     */
    constructor(type = 'ModelE2') {
        super(mustBeString('type', type))
        this._position.modified = true
        this._attitude.modified = true
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._position = void 0
        this._attitude = void 0
    }
    /**
     * <p>
     * The <em>attitude</em>, a unitary spinor.
     * </p>
     * @property R
     * @type G2
     * @readOnly
     */
    get R(): G2 {
        return this._attitude
    }
    set R(unused) {
        throw new Error(readOnly(ModelE2.PROP_ATTITUDE).message)
    }
    /**
     * <p>
     * The <em>position</em>, a vector.
     * The vector <b>X</b> designates the center of mass of the body (Physics).
     * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
     * </p>
     *
     * @property X
     * @type G2
     * @readOnly
     */
    get X(): G2 {
        return this._position
    }
    set X(unused) {
        throw new Error(readOnly(ModelE2.PROP_POSITION).message)
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
                break;
            case ModelE2.PROP_POSITION: {
                return this._posCache.copy(this._position).coords
            }
                break;
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
