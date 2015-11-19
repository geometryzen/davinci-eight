import cannotAssignTypeToProperty = require('../i18n/cannotAssignTypeToProperty')
import CartesianE3 = require('../math/CartesianE3')
import computeFaceNormals = require('../geometries/computeFaceNormals')
import Euclidean3 = require('../math/Euclidean3')
import feedback = require('../feedback/feedback')
import SimplexGeometry = require('../geometries/SimplexGeometry')
import isObject = require('../checks/isObject')
import isUndefined = require('../checks/isUndefined')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import quad = require('../geometries/quadrilateral')
import readOnly = require('../i18n/readOnly')
import Simplex = require('../geometries/Simplex')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')
import triangle = require('../geometries/triangle')
import R1 = require('../math/R1')
import R3 = require('../math/R3')
import VectorE3 = require('../math/VectorE3')
import VectorN = require('../math/VectorN')

/**
 * @class CuboidSimplexGeometry
 * @extends SimplexGeometry
 */
class CuboidSimplexGeometry extends SimplexGeometry {
    /**
     * Parameter is private so that we can detect assignments.
     * @property _a
     * @type {CartesianE3}
     * @private
     */
    private _a: CartesianE3;
    /**
     * Parameter is private so that we can detect assignments.
     * @property _b
     * @type {CartesianE3}
     * @private
     */
    private _b: CartesianE3;
    /**
     * Parameter is private so that we can detect assignments.
     * @property _c
     * @type {CartesianE3}
     * @private
     */
    private _c: CartesianE3;
    /**
     * Used to mark the parameters of this object dirty when they are possibly shared.
     * @property _isModified
     * @type {boolean}
     * @private
     */
    private _isModified: boolean = true;
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
     * @example
         var geometry = new EIGHT.CuboidSimplexGeometry();
         var primitive = geometry.toDrawPrimitive();
         var material = new EIGHT.MeshMaterial();
         var cube = new EIGHT.Drawable([primitive], material);
     */
    constructor(a: VectorE3 = CartesianE3.e1, b: VectorE3 = CartesianE3.e2, c: VectorE3 = CartesianE3.e3, k: number = Simplex.TRIANGLE, subdivide: number = 0, boundary: number = 0) {
        super()
        this._a = CartesianE3.fromVectorE3(a)
        this._b = CartesianE3.fromVectorE3(b)
        this._c = CartesianE3.fromVectorE3(c)
        this.k = k
        this.subdivide(subdivide)
        this.boundary(boundary)
        this.regenerate();
    }
    /**
     * <p>
     * A vector parameterizing the shape of the cuboid.
     * Defaults to the standard basis vector e1.
     * Assignment is by reference making it possible for parameters to be shared references.
     * </p>
     * @property a
     * @type {CartesianE3}
     */
    public get a(): CartesianE3 {
        return this._a
    }
    public set a(a: CartesianE3) {
        this._a = a
        this._isModified = true
    }
    /**
     * <p>
     * A vector parameterizing the shape of the cuboid.
     * Defaults to the standard basis vector e2.
     * Assignment is by reference making it possible for parameters to be shared references.
     * </p>
     * @property b
     * @type {CartesianE3}
     */
    public get b(): CartesianE3 {
        return this._b
    }
    public set b(b: CartesianE3) {
        this._b = b
        this._isModified = true
    }
    /**
     * <p>
     * A vector parameterizing the shape of the cuboid.
     * Defaults to the standard basis vector e3.
     * Assignment is by reference making it possible for parameters to be shared references.
     * </p>
     * @property c
     * @type {CartesianE3}
     */
    public get c(): CartesianE3 {
        return this._c
    }
    public set c(c: CartesianE3) {
        this._c = c
        this._isModified = true
    }
    public isModified() {
        return this._isModified || super.isModified()
    }
    /**
     * @method setModified
     * @param modified {boolean} The value that the modification state will be set to.
     * @return {CuboidSimplexGeometry} `this` instance.
     */
    public setModified(modified: boolean): CuboidSimplexGeometry {
        this._isModified = modified
        super.setModified(modified)
        return this
    }

    /**
     * regenerate the geometry based upon the current parameters.
     * @method regenerate
     * @return {void}
     */
    public regenerate(): void {
        this.setModified(false)

        // Define the anchor points relative to the origin.
        var pos: R3[] = [0, 1, 2, 3, 4, 5, 6, 7].map(function(index) { return void 0 })
        pos[0] = new R3().sub(this._a).sub(this._b).add(this._c).divByScalar(2)
        pos[1] = new R3().add(this._a).sub(this._b).add(this._c).divByScalar(2)
        pos[2] = new R3().add(this._a).add(this._b).add(this._c).divByScalar(2)
        pos[3] = new R3().sub(this._a).add(this._b).add(this._c).divByScalar(2)
        pos[4] = new R3().copy(pos[3]).sub(this._c)
        pos[5] = new R3().copy(pos[2]).sub(this._c)
        pos[6] = new R3().copy(pos[1]).sub(this._c)
        pos[7] = new R3().copy(pos[0]).sub(this._c)

        // Translate the points according to the position.
        let position = this.position
        pos.forEach(function(point: R3) {
            point.add(position)
        })

        function simplex(indices: number[]): Simplex {
            let simplex = new Simplex(indices.length - 1)
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]]
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX] = new R1([i])
            }
            return simplex
        }
        switch (this.k) {
            case 0: {
                var points = [[0], [1], [2], [3], [4], [5], [6], [7]]
                this.data = points.map(function(point) { return simplex(point) })
            }
                break
            case 1: {
                let lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]]
                this.data = lines.map(function(line) { return simplex(line) })
            }
                break
            case 2: {
                var faces: Simplex[][] = [0, 1, 2, 3, 4, 5].map(function(index) { return void 0 })
                faces[0] = quad(pos[0], pos[1], pos[2], pos[3])
                faces[1] = quad(pos[1], pos[6], pos[5], pos[2])
                faces[2] = quad(pos[7], pos[0], pos[3], pos[4])
                faces[3] = quad(pos[6], pos[7], pos[4], pos[5])
                faces[4] = quad(pos[3], pos[2], pos[5], pos[4])
                faces[5] = quad(pos[7], pos[6], pos[1], pos[0])
                this.data = faces.reduce(function(a, b) { return a.concat(b) }, []);

                this.data.forEach(function(simplex) {
                    computeFaceNormals(simplex);
                })
            }
                break
            default: {
            }
        }
        // Compute the meta data.
        this.check()
    }
}

export = CuboidSimplexGeometry;
