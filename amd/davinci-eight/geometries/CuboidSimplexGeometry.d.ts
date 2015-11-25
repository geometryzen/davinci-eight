import CartesianE3 = require('../math/CartesianE3');
import SimplexGeometry = require('../geometries/SimplexGeometry');
import VectorE3 = require('../math/VectorE3');
/**
 * @class CuboidSimplexGeometry
 * @extends SimplexGeometry
 */
declare class CuboidSimplexGeometry extends SimplexGeometry {
    /**
     * Parameter is private so that we can detect assignments.
     * @property _a
     * @type {CartesianE3}
     * @private
     */
    private _a;
    /**
     * Parameter is private so that we can detect assignments.
     * @property _b
     * @type {CartesianE3}
     * @private
     */
    private _b;
    /**
     * Parameter is private so that we can detect assignments.
     * @property _c
     * @type {CartesianE3}
     * @private
     */
    private _c;
    /**
     * Used to mark the parameters of this object dirty when they are possibly shared.
     * @property _isModified
     * @type {boolean}
     * @private
     */
    private _isModified;
    /**
     * <p>
     * The <code>CuboidSimplexGeometry</code> generates simplices representing a cuboid, or more precisely a parallelepiped.
     * The parallelepiped is parameterized by the three vectors <b>a</b>, <b>b</b>, and <b>c</b>.
     * The property <code>k</code> represents the dimensionality of the vertices.
     * The default settings create a unit cube centered at the origin.
     * </p>
     * @class CuboidSimplexGeometry
     * @constructor
     * @param [a = e1] {VectorE3}
     * @param [b = e2] {VectorE3}
     * @param [c = e3] {VectorE3}
     * @param [k = Simplex.TRIANGLE] {number}
     * @param [subdivide = 0] {number = 0}
     * @param [boundary = 0] {number}
     */
    constructor(a?: VectorE3, b?: VectorE3, c?: VectorE3, k?: number, subdivide?: number, boundary?: number);
    /**
     * <p>
     * A vector parameterizing the shape of the cuboid.
     * Defaults to the standard basis vector e1.
     * Assignment is by reference making it possible for parameters to be shared references.
     * </p>
     * @property a
     * @type {CartesianE3}
     */
    a: CartesianE3;
    /**
     * <p>
     * A vector parameterizing the shape of the cuboid.
     * Defaults to the standard basis vector e2.
     * Assignment is by reference making it possible for parameters to be shared references.
     * </p>
     * @property b
     * @type {CartesianE3}
     */
    b: CartesianE3;
    /**
     * <p>
     * A vector parameterizing the shape of the cuboid.
     * Defaults to the standard basis vector e3.
     * Assignment is by reference making it possible for parameters to be shared references.
     * </p>
     * @property c
     * @type {CartesianE3}
     */
    c: CartesianE3;
    isModified(): boolean;
    /**
     * @method setModified
     * @param modified {boolean} The value that the modification state will be set to.
     * @return {CuboidSimplexGeometry} `this` instance.
     */
    setModified(modified: boolean): CuboidSimplexGeometry;
    /**
     * regenerate the geometry based upon the current parameters.
     * @method regenerate
     * @return {void}
     */
    regenerate(): void;
}
export = CuboidSimplexGeometry;
