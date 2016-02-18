import G3 from '../math/G3';
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
import R1m from '../math/R1m';
import R3m from '../math/R3m';
import R2m from '../math/R2m';
import VectorE3 from '../math/VectorE3';

export default class SimplexPrimitivesBuilder extends PrimitivesBuilder implements IPrimitivesBuilder<SimplexPrimitivesBuilder> {
    public data: Simplex[] = [];
    public meta: GeometryMeta;
    private _k = new R1m([Simplex.TRIANGLE]);
    public curvedSegments: number = 16;
    public flatSegments: number = 1;
    public orientationColors: boolean = false;
    constructor() {
        super()
        // Force regenerate, even if derived classes don't call setModified.
        this._k.modified = true
    }
    public get k(): number {
        return this._k.x
    }
    public set k(k: number) {
        this._k.x = mustBeInteger('k', k)
    }
    public regenerate(): void {
        console.warn("`public regenerate(): void` method should be implemented in derived class.")
    }
    public isModified(): boolean {
        return this._k.modified
    }
    public setModified(modified: boolean): SimplexPrimitivesBuilder {
        mustBeBoolean('modified', modified)
        this._k.modified = modified
        return this
    }
    public boundary(times?: number): SimplexPrimitivesBuilder {
        if (this.isModified()) {
            this.regenerate()
        }
        this.data = Simplex.boundary(this.data, times);
        return this.check();
    }
    public check(): SimplexPrimitivesBuilder {
        this.meta = simplicesToGeometryMeta(this.data);
        return this;
    }
    public subdivide(times?: number): SimplexPrimitivesBuilder {
        if (this.isModified()) {
            this.regenerate()
        }
        this.data = Simplex.subdivide(this.data, times);
        this.check();
        return this;
    }
    public setPosition(position: VectorE3): SimplexPrimitivesBuilder {
        super.setPosition(position)
        return this
    }
    public toPrimitives(): Primitive[] {
        if (this.isModified()) {
            this.regenerate()
        }
        this.check()
        return [simplicesToDrawPrimitive(this.data, this.meta)]
    }
    protected mergeVertices(precisionPoints = 4): void {
        // console.warn("SimplexPrimitivesBuilder.mergeVertices not yet implemented");
    }
    public triangle(positions: R3m[], normals: R3m[], uvs: R2m[]): number {
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
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3m.copy(G3.e1)
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3m.copy(G3.e2)
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3m.copy(G3.e3)
        }
        return this.data.push(simplex)
    }
    public lineSegment(positions: R3m[], normals: R3m[], uvs: R2m[]): number {
        var simplex = new Simplex(Simplex.LINE)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvs[0]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvs[1]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3m.copy(G3.e1)
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3m.copy(G3.e2)
        }
        return this.data.push(simplex)
    }
    public point(positions: R3m[], normals: R3m[], uvs: R2m[]): number {
        var simplex = new Simplex(Simplex.POINT)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0]

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvs[0]
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = R3m.copy(G3.e1)
        }
        return this.data.push(simplex)
    }
    public empty(positions: R3m[], normals: R3m[], uvs: R2m[]): number {
        var simplex = new Simplex(Simplex.EMPTY)
        return this.data.push(simplex)
    }
    enableTextureCoords(enable: boolean): SimplexPrimitivesBuilder {
        super.enableTextureCoords(enable)
        return this
    }
}
