import {G3} from '../math/G3';
import GeometryMeta from '../geometries/GeometryMeta';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeInteger from '../checks/mustBeInteger';
import PrimitivesBuilder from '../geometries/PrimitivesBuilder';
import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import simplicesToPrimitive from '../geometries/simplicesToPrimitive';
import simplicesToGeometryMeta from '../geometries/simplicesToGeometryMeta';
import Primitive from '../core/Primitive';
import Vector1 from '../math/Vector1';
import Vector3 from '../math/Vector3';
import {Vector2} from '../math/Vector2';

/**
 * @class SimplexPrimitivesBuilder
 * @extends PrimitivesBuilder
 */
export default class SimplexPrimitivesBuilder extends PrimitivesBuilder {
    public data: Simplex[] = [];
    public meta: GeometryMeta;
    private _k = new Vector1([Simplex.TRIANGLE]);

    /**
     * @property curvedSegments
     * @type number
     * @default 16
     */
    public curvedSegments: number = 16;

    /**
     * @property flatSegments
     * @type number
     * @default 1
     */
    public flatSegments: number = 1;

    /**
     * @property orientationColors
     * @type boolean
     * @default false
     */
    public orientationColors: boolean = false;

    /**
     * @class SimplexPrimitivesBuilder
     * @constructor
     */
    constructor() {
        super()
        // Force regenerate, even if derived classes don't call setModified.
        this._k.modified = true
    }

    /**
     * @properyty k
     * @type number
     */
    public get k(): number {
        return this._k.x
    }
    public set k(k: number) {
        this._k.x = mustBeInteger('k', k)
    }

    /**
     * @method regenerate
     * @return {void}
     * @protected
     */
    protected regenerate(): void {
        throw new Error("`protected regenerate(): void` method should be implemented in derived class.")
    }

    /**
     *
     */
    public isModified(): boolean {
        return this._k.modified
    }
    public setModified(modified: boolean): SimplexPrimitivesBuilder {
        mustBeBoolean('modified', modified)
        this._k.modified = modified
        return this
    }

    /**
     * @method boundary
     * @param [times] {number}
     * @return {SimplexPrimitivesBuilder}
     */
    public boundary(times?: number): SimplexPrimitivesBuilder {
        this.regenerate()
        this.data = Simplex.boundary(this.data, times);
        return this.check();
    }
    public check(): SimplexPrimitivesBuilder {
        this.meta = simplicesToGeometryMeta(this.data);
        return this;
    }
    public subdivide(times?: number): SimplexPrimitivesBuilder {
        this.regenerate()
        this.data = Simplex.subdivide(this.data, times);
        this.check();
        return this;
    }
    public toPrimitives(): Primitive[] {
        this.regenerate()
        this.check()
        return [simplicesToPrimitive(this.data, this.meta)]
    }
    protected mergeVertices(precisionPoints = 4): void {
        // console.warn("SimplexPrimitivesBuilder.mergeVertices not yet implemented");
    }
    public triangle(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        var simplex = new Simplex(Simplex.TRIANGLE)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1]
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[2]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1]
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[2]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[1]
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[2]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.copy(G3.e1)
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.copy(G3.e2)
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.copy(G3.e3)
        }
        return this.data.push(simplex)
    }
    public lineSegment(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        var simplex = new Simplex(Simplex.LINE)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[1]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.copy(G3.e1)
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.copy(G3.e2)
        }
        return this.data.push(simplex)
    }
    public point(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        var simplex = new Simplex(Simplex.POINT)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.copy(G3.e1)
        }
        return this.data.push(simplex)
    }
    public empty(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        var simplex = new Simplex(Simplex.EMPTY)
        return this.data.push(simplex)
    }
}
