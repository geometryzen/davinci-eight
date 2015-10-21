import VectorE3 = require('../math/VectorE3');
import SliceSimplexGeometry = require('../geometries/SliceSimplexGeometry');
/**
 * @class RingSimplexGeometry
 * @extends SliceSimplexGeometry
 */
declare class RingSimplexGeometry extends SliceSimplexGeometry {
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
     * @class RingSimplexGeometry
     * @constructor
     * @param a [number = 1] The outer radius
     * @param b [number = 0] The inner radius
     * @param axis [VectorE3] The <code>axis</code> property.
     * @param sliceStart [VectorE3] The <code>sliceStart</code> property.
     * @param sliceAngle [number] The <code>sliceAngle</code> property.
     */
    constructor(a?: number, b?: number, axis?: VectorE3, sliceStart?: VectorE3, sliceAngle?: number);
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
     * @return {RingSimplexGeometry}
     * @chainable
     */
    setModified(modified: boolean): RingSimplexGeometry;
}
export = RingSimplexGeometry;
