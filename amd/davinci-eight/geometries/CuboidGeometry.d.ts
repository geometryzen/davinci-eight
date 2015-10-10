import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
/**
 * @class CuboidGeometry
 * @extends Geometry
 */
declare class CuboidGeometry extends Geometry {
    /**
     * @property a {Vector3} A vector parameterizing the shape of the cuboid. Defaults to the standard basis vector e1.
     */
    a: Vector3;
    /**
     * @property b {Vector3} A vector parameterizing the shape of the cuboid. Defaults to the standard basis vector e2.
     */
    b: Vector3;
    /**
     * @property c {Vector3} A vector parameterizing the shape of the cuboid. Defaults to the standard basis vector e3.
     */
    c: Vector3;
    /**
     * @property _k {number} The dimensionality of the simplices representing the cuboid.
     * @private
     */
    private _k;
    /**
     * <p>
     * The <code>CuboidGeometry</code> generates simplices representing a cuboid, or more precisely a parallelepiped.
     * The parallelepiped is parameterized by the three vectors <b>a</b>, <b>b</b>, and <b>c</b>.
     * The property <code>k</code> represents the dimensionality of the vertices.
     * The default settings create a unit cube centered at the origin.
     * </p>
     * @class CuboidGeometry
     * @constructor
     * @param type [string = 'CuboidGeometry']
     * @example
         var geometry = new EIGHT.CuboidGeometry();
         var elements = geometry.toElements();
         var material = new EIGHT.LineMaterial();
         var cube = new EIGHT.Drawable(elements, material);
     */
    constructor(type?: string);
    /**
     *
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
