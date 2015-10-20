import Cartesian3 = require('../math/Cartesian3')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import GeometryMeta = require('../geometries/GeometryMeta')
import IGeometry = require('../geometries/IGeometry')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import Simplex = require('../geometries/Simplex')
import Symbolic = require('../core/Symbolic')
import simplicesToDrawPrimitive = require('../geometries/simplicesToDrawPrimitive')
import simplicesToGeometryMeta = require('../geometries/simplicesToGeometryMeta')
import MutableNumber = require('../math/MutableNumber')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

/**
 * @class SimplexGeometry
 * @extends Shareable
 */
class SimplexGeometry extends Shareable implements IGeometry<SimplexGeometry> {
    /**
     * The geometry as a list of simplices.
     * A simplex, in the context of WebGL, will usually represent a triangle, line or point.
     * @property data
     * @type {Simplex[]}
     */
    public data: Simplex[] = [];
    /**
     * Summary information on the simplices such as dimensionality and sizes for attributes.
     * This data structure may be used to map vertex attribute names to program names.
     * @property meta
     * @type {GeometryMeta}
     */
    public meta: GeometryMeta;
    /**
     * The dimensionality of the simplices in this geometry.
     * @property _k
     * @type {number}
     * @private
     */
    private _k = new MutableNumber([Simplex.TRIANGLE]);
    /**
     * Specifies the number of segments to use in curved directions.
     * @property curvedSegments
     * @type {number}
     */
    public curvedSegments: number = 16;
    /**
     * Specifies the number of segments to use on flat surfaces.
     * @property flatSegments
     * @type {number}
     */
    public flatSegments: number = 1;
    /**
     * <p>
     * Specifies that the geometry should set colors on vertex attributes
     * for visualizing orientation of triangles
     * </p>
     * @property orientationColors
     * @type {boolean}
     */
    public orientationColors: boolean = false;

    // public dynamic = true;
    // public verticesNeedUpdate = false;
    // public elementsNeedUpdate = false;
    // public uvsNeedUpdate = false;
    /**
     * <p>
     * A list of simplices (data) with information about dimensionality and vertex properties (meta). 
     * This class should be used as an abstract base or concrete class when constructing
     * geometries that are to be manipulated in JavaScript (as opposed to GLSL shaders).
     * The <code>SimplexGeometry</code> class implements IUnknown, as a convenience to implementations
     * requiring special de-allocation of resources, by extending <code>Shareable</code>.
     * </p>
     * @class SimplexGeometry
     * @constructor
     * @param type [string = 'SimplexGeometry']
     */
    constructor(type: string = 'SimplexGeometry') {
        super(mustBeString('type', type))
        // Force regenerate, even if derived classes don't call setModified.
        this._k.modified = true
    }
    /**
     * The destructor method should be implemented in derived classes and the super.destructor called
     * as the last call in the derived class destructor.
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }
    /**
     * <p>
     * The dimensionality of the simplices in this geometry.
     * </p>
     * <p>
     * The <code>k</code> parameter affects geometry generation.
     * </p>
     * <code>k</code> must be an integer.
     * @property k
     * @type {number}
     */
    public get k(): number {
        return this._k.x
    }
    public set k(k: number) {
        this._k.x = mustBeInteger('k', k)
    }
    /**
     * Used to regenerate the simplex data from geometry parameters.
     * This method should be implemented by the derived geometry class.
     * @method regenerate
     * @return {void}
     */
    public regenerate(): void {
        console.warn("`public regenerate(): void` method should be implemented by `" + this._type + "`.")
    }
    /**
     * Used to determine whether the geometry must be recalculated.
     * The base implementation is pessimistic and returns <code>true</code>.
     * This method should be implemented by the derived class to reduce frequent recalculation.
     * @method isModified
     * @return {boolean} if the parameters defining the geometry have been modified.
     */
    public isModified(): boolean {
        return this._k.modified
    }
    /**
     * Sets the modification state of <code>this</code> instance.
     * Derived classes should override this method if they contain parameters which affect geometry calculation. 
     * @method setModified
     * @param modified {boolean} The value that the modification state will be set to.
     * @return {SimplexGeometry} `this` instance.
     * @chainable
     */
    public setModified(modified: boolean): SimplexGeometry {
        this._k.modified = modified
        return this
    }
    /**
     * <p>
     * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
     * </p>
     * <p>
     * The boundary operation converts simplices of dimension `n` to `n - 1`.
     * For example, triangles are converted to lines.
     * </p>
     *
     * @method boundary
     * @param times {number} Determines the number of times the boundary operation is applied to this instance.
     * @return {SimplexGeometry}
     */
    public boundary(times?: number): SimplexGeometry {
        if (this.isModified()) {
            this.regenerate()
        }
        this.data = Simplex.boundary(this.data, times);
        return this.check();
    }
    /**
     * Updates the meta property of this instance to match the data.
     *
     * @method check
     * @return {SimplexGeometry}
     * @beta
     */
    // FIXME: Rename to something more suggestive.
    public check(): SimplexGeometry {
        this.meta = simplicesToGeometryMeta(this.data);
        return this;
    }
    /**
     * <p>
     * Applies the subdivide operation to each Simplex in this instance the specified number of times.
     * </p>
     * <p>
     * The subdivide operation creates new simplices of the same dimension as the originals.
     * </p>
     *
     * @method subdivide
     * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
     * @return {SimplexGeometry}
     */
    public subdivide(times?: number): SimplexGeometry {
        if (this.isModified()) {
            this.regenerate()
        }
        this.data = Simplex.subdivide(this.data, times);
        this.check();
        return this;
    }
    public setPosition(position: Cartesian3) {
        return this
    }
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    public toPrimitives(): DrawPrimitive[] {
        if (this.isModified()) {
            this.regenerate()
        }
        this.check()
        return [simplicesToDrawPrimitive(this.data, this.meta)]
    }
    /**
     * @method mergeVertices
     * @param precisionPonts [number = 4]
     * @return {void}
     * @protected
     * @beta
     */
    protected mergeVertices(precisionPoints: number = 4): void {
        // console.warn("SimplexGeometry.mergeVertices not yet implemented");
    }
    /**
     * Convenience method for pushing attribute data as a triangular simplex
     * @method triangle
     * @param positions {Vector3[]}
     * @param normals {Vector3[]}
     * @param uvs {Vector2[]}
     * @return {number}
     * @beta
     */
    public triangle(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        var simplex = new Simplex(Simplex.TRIANGLE)
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[1]
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[2]

        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[1]
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[2]

        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[1]
        simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[2]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e1.clone()
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e2.clone()
            simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e3.clone()
        }
        return this.data.push(simplex)
    }
    public lineSegment(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        var simplex = new Simplex(Simplex.LINE)
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[1]

        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[1]

        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[1]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e1.clone()
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e2.clone()
        }
        return this.data.push(simplex)
    }
    public point(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        var simplex = new Simplex(Simplex.POINT)
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0]

        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0]

        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e1.clone()
        }
        return this.data.push(simplex)
    }
    public empty(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        var simplex = new Simplex(Simplex.EMPTY)
        return this.data.push(simplex)
    }
    enableTextureCoords(enable: boolean): SimplexGeometry {
        //        mustBeBoolean('enable', enable)
        //        this.useTextureCoords = enable
        return this
    }
}

export = SimplexGeometry;
