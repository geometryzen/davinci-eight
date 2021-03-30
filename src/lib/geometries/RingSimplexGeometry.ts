import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { arc3 } from '../geometries/arc3';
import { Simplex } from '../geometries/Simplex';
import { SimplexMode } from '../geometries/SimplexMode';
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { SliceSimplexPrimitivesBuilder } from '../geometries/SliceSimplexPrimitivesBuilder';
import { Spinor3 } from '../math/Spinor3';
import { SpinorE3 } from '../math/SpinorE3';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';

/**
 * @hidden
 */
function computeVertices(a: number, b: number, axis: VectorE3, start: VectorE3, angle: number, generator: SpinorE3, radialSegments: number, thetaSegments: number, vertices: Vector3[], uvs: Vector2[]) {
    /**
     * `t` is the vector perpendicular to s in the plane of the ring.
     * We could use the generator an PI / 4 to calculate this or the cross product as here.
     */
    const perp = Vector3.copy(axis).cross(start);
    /**
     * The distance of the vertex from the origin and center.
     */
    let radius = b;
    const radiusStep = (a - b) / radialSegments;

    for (let i = 0; i < radialSegments + 1; i++) {
        const begin = Vector3.copy(start).scale(radius);
        const arcPoints = arc3(begin, angle, generator, thetaSegments);
        for (let j = 0, jLength = arcPoints.length; j < jLength; j++) {
            const arcPoint = arcPoints[j];
            vertices.push(arcPoint);
            // The coordinates vary between -a and +a, which we map to 0 and 1.
            uvs.push(new Vector2([(arcPoint.dot(start) / a + 1) / 2, (arcPoint.dot(perp) / a + 1) / 2]));
        }
        radius += radiusStep;
    }
}

/**
 * @hidden
 */
function vertexIndex(i: number, j: number, thetaSegments: number): number {
    return i * (thetaSegments + 1) + j;
}

/**
 * @hidden
 */
function makeTriangles(vertices: Vector3[], uvs: Vector2[], axis: VectorE3, radialSegments: number, thetaSegments: number, geometry: SimplexPrimitivesBuilder) {
    for (let i = 0; i < radialSegments; i++) {
        // Our traversal has resulted in the following formula for the index
        // into the vertices or uvs array
        // vertexIndex(i, j) => i * (thetaSegments + 1) + j
        /**
         * The index along the start radial line where j = 0. This is just index(i,0)
         */
        const startLineIndex = i * (thetaSegments + 1);

        for (let j = 0; j < thetaSegments; j++) {
            /**
             * The index of the corner of the quadrilateral with the lowest value of i and j.
             * This corresponds to the smallest radius and smallest angle counterclockwise. 
             */
            const quadIndex = startLineIndex + j;

            let v0 = quadIndex;
            let v1 = quadIndex + thetaSegments + 1;  // Move outwards one segment.
            let v2 = quadIndex + thetaSegments + 2;  // Then move one segment along the radius.

            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [Vector3.copy(axis), Vector3.copy(axis), Vector3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);

            v0 = quadIndex; // Start at the same corner
            v1 = quadIndex + thetaSegments + 2; // Move diagonally outwards and along radial
            v2 = quadIndex + 1;  // Then move radially inwards

            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [Vector3.copy(axis), Vector3.copy(axis), Vector3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);
        }
    }
}

/**
 * @hidden
 */
function makeLineSegments(vertices: Vector3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i < radialSegments; i++) {
        for (let j = 0; j < thetaSegments; j++) {
            let simplex = new Simplex(SimplexMode.LINE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j + 1, thetaSegments)];
            data.push(simplex);

            simplex = new Simplex(SimplexMode.LINE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, j, thetaSegments)];
            data.push(simplex);
        }
        // TODO: We probably don't need these lines when the thing is closed 
        const simplex = new Simplex(SimplexMode.LINE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, thetaSegments, thetaSegments)];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, thetaSegments, thetaSegments)];
        data.push(simplex);
    }
    // Lines for the outermost circle.
    for (let j = 0; j < thetaSegments; j++) {
        const simplex = new Simplex(SimplexMode.LINE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j, thetaSegments)];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j + 1, thetaSegments)];
        data.push(simplex);
    }
}

/**
 * @hidden
 */
function makePoints(vertices: Vector3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i <= radialSegments; i++) {
        for (let j = 0; j <= thetaSegments; j++) {
            const simplex = new Simplex(SimplexMode.POINT);
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
            data.push(simplex);
        }
    }
}

/**
 * @hidden
 */
function makeEmpty(vertices: Vector3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i <= radialSegments; i++) {
        for (let j = 0; j <= thetaSegments; j++) {
            const simplex = new Simplex(SimplexMode.EMPTY);
            data.push(simplex);
        }
    }
}

/**
 * @hidden
 */
export class RingSimplexGeometry extends SliceSimplexPrimitivesBuilder {
    public a: number;
    public b: number;
    private e = Vector3.vector(0, 1, 0);
    private cutLine = Vector3.vector(0, 0, 1);
    constructor(a = 1, b = 0, sliceAngle?: number) {
        super();
        this.a = a;
        this.b = b;
    }
    public isModified(): boolean {
        return super.isModified();
    }
    public regenerate(): void {
        this.data = [];

        const radialSegments = this.flatSegments;
        const thetaSegments = this.curvedSegments;
        // TODO: The generator does not have to be dual to the axis
        const generator: SpinorE3 = Spinor3.dual(this.e, false);

        const vertices: Vector3[] = [];
        const uvs: Vector2[] = [];

        computeVertices(this.a, this.b, this.e, this.cutLine, this.sliceAngle, generator, radialSegments, thetaSegments, vertices, uvs);
        switch (this.k) {
            case SimplexMode.EMPTY: {
                makeEmpty(vertices, radialSegments, thetaSegments, this.data);
                break;
            }
            case SimplexMode.POINT: {
                makePoints(vertices, radialSegments, thetaSegments, this.data);
                break;
            }
            case SimplexMode.LINE: {
                makeLineSegments(vertices, radialSegments, thetaSegments, this.data);
                break;
            }
            case SimplexMode.TRIANGLE: {
                makeTriangles(vertices, uvs, this.e, radialSegments, thetaSegments, this);
                break;
            }
            default: {
                console.warn(this.k + "-simplex is not supported for geometry generation.");
            }
        }

        this.setModified(false);
    }
    public setModified(modified: boolean): RingSimplexGeometry {
        super.setModified(modified);
        return this;
    }
}
