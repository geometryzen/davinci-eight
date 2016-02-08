import Euclidean3 from '../math/Euclidean3';
import GeometryMeta from '../geometries/GeometryMeta';
import IPrimitivesBuilder from '../geometries/IPrimitivesBuilder';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeInteger from '../checks/mustBeInteger';
import PrimitivesBuilder from '../geometries/PrimitivesBuilder';
import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import simplicesToDrawPrimitive from '../geometries/simplicesToDrawPrimitive';
import simplicesToGeometryMeta from '../geometries/simplicesToGeometryMeta';
import Primitive from '../core/Primitive';
import R1 from '../math/R1';
import R3 from '../math/R3';
import R2 from '../math/R2';
import VectorE3 from '../math/VectorE3';

/**
 * @class SimplexGeometry
 * @extends PrimitivesBuilder
 */
export default class SimplexGeometry extends PrimitivesBuilder implements IPrimitivesBuilder<SimplexGeometry> {
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
    private _k = new R1([Simplex.TRIANGLE]);

    /**
     * Specifies the number of segments to use in curved directions.
     * @property curvedSegments
     * @type {number}
     * @beta
     */
    public curvedSegments: number = 16;

    /**
     * Specifies the number of segments to use on flat surfaces.
     * @property flatSegments
     * @type {number}
     * @beta
     */
    public flatSegments: number = 1;

    /**
     * <p>
     * Specifies that the geometry should set colors on vertex attributes
     * for visualizing orientation of triangles
     * </p>
     * @property orientationColors
     * @type {boolean}
     * @beta
     */
    public orientationColors: boolean = false;

    /**
     * <p>
     * A list of simplices (data) with information about dimensionality and vertex properties (meta). 
     * This class should be used as an abstract base or concrete class when constructing
     * geometries that are to be manipulated in JavaScript (as opposed to GLSL shaders).
     * </p>
     * @class SimplexGeometry
     * @constructor
     */
    constructor() {
        super()
        // Force regenerate, even if derived classes don't call setModified.
        this._k.modified = true
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
        console.warn("`public regenerate(): void` method should be implemented in derived class.")
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
        mustBeBoolean('modified', modified)
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
     * @param [times] {number} Determines the number of times the boundary operation is applied to this instance.
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
     * @param [times] {number} Determines the number of times the subdivide operation is applied to this instance.
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

    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {SimplexGeometry}
     * @chainable
     */
    public setPosition(position: VectorE3): SimplexGeometry {
        super.setPosition(position)
        return this
    }

    /**
     * @method toPrimitives
     * @return {Primitive[]}
     */
    public toPrimitives(): Primitive[] {
        if (this.isModified()) {
            this.regenerate()
        }
        this.check()
        return [simplicesToDrawPrimitive(this.data, this.meta)]
    }

    /**
     * @method mergeVertices
     * @param [precisionPonts = 4] {number}
     * @return {void}
     * @protected
     * @beta
     */
    protected mergeVertices(precisionPoints = 4): void {
        // console.warn("SimplexGeometry.mergeVertices not yet implemented");
    }

    /**
     * Convenience method for pushing attribute data as a triangular simplex
     * @method triangle
     * @param positions {R3[]}
     * @param normals {R3[]}
     * @param uvs {R2[]}
     * @return {number}
     * @beta
     */
    public triangle(positions: R3[], normals: R3[], uvs: R2[]): number {
        var simplex = new Simplex(Simplex.TRIANGLE)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1]
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[2]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1]
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[2]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvs[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvs[1]
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvs[2]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e1)
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e2)
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e3)
        }
        return this.data.push(simplex)
    }

    /**
     * Convenience method for pushing attribute data as a line segment simplex
     * @method lineSegment
     * @param positions {R3[]}
     * @param normals {R3[]}
     * @param uvs {R2[]}
     * @return {number}
     */
    public lineSegment(positions: R3[], normals: R3[], uvs: R2[]): number {
        var simplex = new Simplex(Simplex.LINE)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvs[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvs[1]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e1)
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e2)
        }
        return this.data.push(simplex)
    }

    /**
     * Convenience method for pushing attribute data as a point simplex
     * @method point
     * @param positions {R3[]}
     * @param normals {R3[]}
     * @param uvs {R2[]}
     * @return {number}
     */
    public point(positions: R3[], normals: R3[], uvs: R2[]): number {
        var simplex = new Simplex(Simplex.POINT)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvs[0]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e1)
        }
        return this.data.push(simplex)
    }

    /**
     * Convenience method for pushing attribute data as an empty simplex
     * @method empty
     * @param positions {R3[]}
     * @param normals {R3[]}
     * @param uvs {R2[]}
     * @return {number}
     */
    public empty(positions: R3[], normals: R3[], uvs: R2[]): number {
        var simplex = new Simplex(Simplex.EMPTY)
        return this.data.push(simplex)
    }

    /**
     * @method enableTextureCoords
     * @param enable {boolean}
     * @return {SimplexGeometry}
     */
    enableTextureCoords(enable: boolean): SimplexGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
