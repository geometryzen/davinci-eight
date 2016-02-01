import IAnimationTarget from '../slideshow/IAnimationTarget';
import mustBeString from '../checks/mustBeString';
import G3 from '../math/G3';
import R3 from '../math/R3';
import SpinG3 from '../math/SpinG3';
import readOnly from '../i18n/readOnly';
import Shareable from '../utils/Shareable';

/**
 * @class ModelE3
 */
export default class ModelE3 extends Shareable implements IAnimationTarget {
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
     * @type {G3}
     * @private
     */
    private _position = new G3().zero();

    /**
     * @property _attitude
     * @type {G3}
     * @private
     */
    private _attitude = new G3().zero().addScalar(1);

    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     * @property _posCache
     * @type {R3}
     * @private
     */
    private _posCache = new R3();
    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     * @property _attCache
     * @type {SpinG3}
     * @private
     */
    private _attCache = new SpinG3();
    /**
     * <p>
     * A collection of properties for Rigid Body Modeling.
     * </p>
     * <p>
     * ModelE3 implements Facet required for manipulating a drawable object.
     * </p>
     * <p>
     * Constructs a ModelE3 at the origin and with unity attitude.
     * </p>
     * @class ModelE3
     * @constructor
     * @param type [string = 'ModelE3'] The name used for reference counting.
     */
    constructor(type: string = 'ModelE3') {
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
        super.destructor()
    }
    /**
     * <p>
     * The <em>attitude</em>, a unitary spinor.
     * </p>
     * @property R
     * @type G3
     * @readOnly
     */
    get R(): G3 {
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
     * @type G3
     * @readOnly
     */
    get X(): G3 {
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
     * @return {void}
     */
    setProperty(name: string, data: number[]): void {
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
    }
}
