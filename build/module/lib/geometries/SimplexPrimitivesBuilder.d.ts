import { Primitive } from '../core/Primitive';
import { GeometryMeta } from '../geometries/GeometryMeta';
import { PrimitivesBuilder } from '../geometries/PrimitivesBuilder';
import { Simplex } from '../geometries/Simplex';
import { SimplexMode } from '../geometries/SimplexMode';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
/**
 * @hidden
 */
export declare class SimplexPrimitivesBuilder extends PrimitivesBuilder {
    data: Simplex[];
    meta: GeometryMeta;
    private _k;
    curvedSegments: number;
    flatSegments: number;
    orientationColors: boolean;
    constructor();
    get k(): SimplexMode;
    set k(k: SimplexMode);
    protected regenerate(): void;
    /**
     *
     */
    isModified(): boolean;
    setModified(modified: boolean): SimplexPrimitivesBuilder;
    boundary(times?: number): SimplexPrimitivesBuilder;
    check(): SimplexPrimitivesBuilder;
    subdivide(times?: number): SimplexPrimitivesBuilder;
    toPrimitives(): Primitive[];
    protected mergeVertices(): void;
    triangle(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number;
    lineSegment(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number;
    point(positions: Vector3[], normals: Vector3[], uvs: Vector2[]): number;
}
