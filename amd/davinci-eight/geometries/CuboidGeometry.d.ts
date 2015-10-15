import Cartesian3 = require('../math/Cartesian3');
import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
/**
 * @class CuboidGeometry
 * @extends Geometry
 */
declare class CuboidGeometry extends Geometry {
    /**
     * Parameter is private so that we can detect assignments.
     * @property _a
     * @type {Vector3}
     * @private
     */
    private _a;
    /**
     * Parameter is private so that we can detect assignments.
     * @property _b
     * @type {Vector3}
     * @private
     */
    private _b;
    /**
     * Parameter is private so that we can detect assignments.
     * @property _c
     * @type {Vector3}
     * @private
     */
    private _c;
    /**
     * @property _k {number} The dimensionality of the simplices representing the cuboid.
     * @private
     */
    private _k;
    /**
     * Used to mark the parameters of this object dirty when they are possibly shared.
     * @property _isModified
     * @type {boolean}
     * @private
     */
    private _isModified;
    /**
     * <p>
     * The <code>CuboidGeometry</code> generates simplices representing a cuboid, or more precisely a parallelepiped.
     * The parallelepiped is parameterized by the three vectors <b>a</b>, <b>b</b>, and <b>c</b>.
     * The property <code>k</code> represents the dimensionality of the vertices.
     * The default settings create a unit cube centered at the origin.
     * </p>
     * @class CuboidGeometry
     * @constructor
     * @param a [Cartesian3 = Vector3.e1]
     * @param b [Cartesian3 = Vector3.e1]
     * @param c [Cartesian3 = Vector3.e1]
     * @param k [number = Simplex.K_FOR_TRIANGLE]
     * @param subdivide [number = 0]
     * @param boundary [number = 0]
     * @example
         var geometry = new EIGHT.CuboidGeometry();
         var elements = geometry.toElements();
         var material = new EIGHT.LineMaterial();
         var cube = new EIGHT.Drawable(elements, material);
     */
    constructor(a?: Cartesian3, b?: Cartesian3, c?: Cartesian3, k?: number, subdivide?: number, boundary?: number);
    protected destructor(): void;
    /**
     * <p>
     * A vector parameterizing the shape of the cuboid.
     * Defaults to the standard basis vector e1.
     * Assignment is by reference making it possible for parameters to be shared references.
     * </p>
     * @property a
     * @type {Vector3}
     */
    a: Vector3;
    /**
     * <p>
     * A vector parameterizing the shape of the cuboid.
     * Defaults to the standard basis vector e2.
     * Assignment is by reference making it possible for parameters to be shared references.
     * </p>
     * @property b
     * @type {Vector3}
     */
    b: Vector3;
    /**
     * <p>
     * A vector parameterizing the shape of the cuboid.
     * Defaults to the standard basis vector e3.
     * Assignment is by reference making it possible for parameters to be shared references.
     * </p>
     * @property c
     * @type {Vector3}
     */
    c: Vector3;
    /**
     * @property k
     * @type {number}
     */
    k: number;
    isModified(): boolean;
    /**
     * @method setModified
     * @param modified {boolean} The value that the modification state will be set to.
     * @return {CuboidGeometry} `this` instance.
     */
    setModified(modified: boolean): CuboidGeometry;
    /**
     * recalculate the geometry based upon the current parameters.
     * @method recalculate
     * @return {void}
     */
    recalculate(): void;
}
export = CuboidGeometry;
