import Cartesian3 = require('../math/Cartesian3');
import SliceGeometry = require('../geometries/SliceGeometry');
/**
 * @class RingGeometry
 * @extends SliceGeometry
 */
declare class RingGeometry extends SliceGeometry {
    /**
     * The outer radius.
     * @property a
     * @type {number}
     */
    a: number;
    /**
     * The inner radius.
     * @property b
     * @type {number}
     */
    b: number;
    /**
     * <p>
     * Creates an annulus with a single hole.
     * </p>
     * <p>
     * Sets the <code>sliceAngle</code> property to <code>2 * Math.PI</p>.
     * </p>
     * @class RingGeometry
     * @constructor
     * @param a [number = 1] The outer radius
     * @param b [number = 0] The inner radius
     * @param axis [Cartesian3] The <code>axis</code> property.
     * @param sliceStart [Cartesian3] The <code>sliceStart</code> property.
     * @param sliceAngle [number] The <code>sliceAngle</code> property.
     */
    constructor(a?: number, b?: number, axis?: Cartesian3, sliceStart?: Cartesian3, sliceAngle?: number);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method isModified
     * @return {boolean}
     */
    isModified(): boolean;
    /**
     * @method regenerate
     * @return {void}
     */
    regenerate(): void;
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {RingGeometry}
     * @chainable
     */
    setModified(modified: boolean): RingGeometry;
}
export = RingGeometry;
