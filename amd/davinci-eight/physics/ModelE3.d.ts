import IAnimationTarget = require('../slideshow/IAnimationTarget');
import G3 = require('../math/G3');
import Shareable = require('../utils/Shareable');
/**
 * @class ModelE3
 */
declare class ModelE3 extends Shareable implements IAnimationTarget {
    /**
     * The name of the property that designates the attitude.
     * @property PROP_ATTITUDE
     * @type {string}
     * @default 'R'
     * @static
     * @readOnly
     */
    static PROP_ATTITUDE: string;
    /**
     * The name of the property that designates the position.
     * @property PROP_POSITION
     * @type {string}
     * @default 'X'
     * @static
     * @readOnly
     */
    static PROP_POSITION: string;
    /**
     * @property _position
     * @type {G3}
     * @private
     */
    private _position;
    /**
     * @property _attitude
     * @type {G3}
     * @private
     */
    private _attitude;
    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     * @property _posCache
     * @type {R3}
     * @private
     */
    private _posCache;
    /**
     * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
     * @property _attCache
     * @type {SpinG3}
     * @private
     */
    private _attCache;
    /**
     * <p>
     * A collection of properties for Rigid Body Modeling.
     * </p>
     * <p>
     * ModelE3 implements IFacet required for manipulating a drawable object.
     * </p>
     * <p>
     * Constructs a ModelE3 at the origin and with unity attitude.
     * </p>
     * @class ModelE3
     * @constructor
     * @param type [string = 'ModelE3'] The name used for reference counting.
     */
    constructor(type?: string);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * <p>
     * The <em>attitude</em>, a unitary spinor.
     * </p>
     * @property R
     * @type G3
     * @readOnly
     */
    R: G3;
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
    X: G3;
    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[];
    /**
     * @method setProperty
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    setProperty(name: string, data: number[]): void;
}
export = ModelE3;
