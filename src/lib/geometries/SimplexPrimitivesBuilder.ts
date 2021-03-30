import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeInteger } from '../checks/mustBeInteger';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Primitive } from '../core/Primitive';
import { GeometryMeta } from '../geometries/GeometryMeta';
import { PrimitivesBuilder } from '../geometries/PrimitivesBuilder';
import { Simplex } from '../geometries/Simplex';
import { SimplexMode } from '../geometries/SimplexMode';
import { simplicesToGeometryMeta } from '../geometries/simplicesToGeometryMeta';
import { simplicesToPrimitive } from '../geometries/simplicesToPrimitive';
import { Vector1 } from '../math/Vector1';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

/**
 * @hidden
 */
export class SimplexPrimitivesBuilder extends PrimitivesBuilder {
    public data: Simplex[] = [];
    public meta: GeometryMeta;
    private _k = new Vector1([SimplexMode.TRIANGLE]);

    public curvedSegments = 16;

    public flatSegments = 1;

    public orientationColors = false;

    constructor() {
        super();
        // Force regenerate, even if derived classes don't call setModified.
        this._k.modified = true;
    }

    public get k(): SimplexMode {
        return this._k.x;
    }
    public set k(k: SimplexMode) {
        this._k.x = mustBeInteger('k', k);
    }

    protected regenerate(): void {
        throw new Error("`protected regenerate(): void` method should be implemented in derived class.");
    }

    /**
     *
     */
    public isModified(): boolean {
        return this._k.modified;
    }
    public setModified(modified: boolean): SimplexPrimitivesBuilder {
        mustBeBoolean('modified', modified);
        this._k.modified = modified;
        return this;
    }

    public boundary(times?: number): SimplexPrimitivesBuilder {
        this.regenerate();
        this.data = Simplex.boundary(this.data, times);
        return this.check();
    }
    public check(): SimplexPrimitivesBuilder {
        this.meta = simplicesToGeometryMeta(this.data);
        return this;
    }
    public subdivide(times?: number): SimplexPrimitivesBuilder {
        this.regenerate();
        this.data = Simplex.subdivide(this.data, times);
        this.check();
        return this;
    }
    public toPrimitives(): Primitive[] {
        this.regenerate();
        this.check();
        return [simplicesToPrimitive(this.data, this.meta)];
    }
    protected mergeVertices(/* precisionPoints = 4 */): void {
        // console.warn("SimplexPrimitivesBuilder.mergeVertices not yet implemented");
    }
    public triangle(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        const simplex = new Simplex(SimplexMode.TRIANGLE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1];
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[2];

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1];
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[2];

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[1];
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[2];
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(1, 0, 0);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(0, 1, 0);
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(0, 0, 1);
        }
        return this.data.push(simplex);
    }
    public lineSegment(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        const simplex = new Simplex(SimplexMode.LINE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1];

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1];

        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[1];
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(1, 0, 0);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(0, 1, 0);
        }
        return this.data.push(simplex);
    }
    public point(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        const simplex = new Simplex(SimplexMode.POINT);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0];
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(1, 0, 0);
        }
        return this.data.push(simplex);
    }
    /*
    public empty(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number {
        const simplex = new Simplex(SimplexMode.EMPTY);
        return this.data.push(simplex);
    }
    */
}
