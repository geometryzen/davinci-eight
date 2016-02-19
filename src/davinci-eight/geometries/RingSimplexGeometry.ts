import arc3 from '../geometries/arc3';
import R3 from '../math/R3';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import Simplex from '../geometries/Simplex';
import SliceSimplexPrimitivesBuilder from '../geometries/SliceSimplexPrimitivesBuilder';
import Spinor3 from '../math/Spinor3';
import SpinorE3 from '../math/SpinorE3';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

function computeVertices(a: number, b: number, axis: R3, start: VectorE3, angle: number, generator: SpinorE3, radialSegments: number, thetaSegments: number, vertices: Vector3[], uvs: Vector2[]) {
    /**
     * `t` is the vector perpendicular to s in the plane of the ring.
     * We could use the generator an PI / 4 to calculate this or the cross product as here.
     */
    var perp = Vector3.copy(axis).cross(start)
    /**
     * The distance of the vertex from the origin and center.
     */
    var radius = b
    var radiusStep = (a - b) / radialSegments

    for (var i = 0; i < radialSegments + 1; i++) {
        var begin = Vector3.copy(start).scale(radius)
        var arcPoints = arc3(begin, angle, generator, thetaSegments)
        for (var j = 0, jLength = arcPoints.length; j < jLength; j++) {
            var arcPoint = arcPoints[j]
            vertices.push(arcPoint)
            // The coordinates vary between -a and +a, which we map to 0 and 1.
            uvs.push(new Vector2([(arcPoint.dot(start) / a + 1) / 2, (arcPoint.dot(perp) / a + 1) / 2]))
        }
        radius += radiusStep;
    }
}

function vertexIndex(i: number, j: number, thetaSegments: number): number {
    return i * (thetaSegments + 1) + j
}

function makeTriangles(vertices: Vector3[], uvs: Vector2[], axis: R3, radialSegments: number, thetaSegments: number, geometry: SimplexPrimitivesBuilder) {
    for (var i = 0; i < radialSegments; i++) {
        // Our traversal has resulted in the following formula for the index
        // into the vertices or uvs array
        // vertexIndex(i, j) => i * (thetaSegments + 1) + j
        /**
         * The index along the start radial line where j = 0. This is just index(i,0)
         */
        var startLineIndex = i * (thetaSegments + 1)

        for (var j = 0; j < thetaSegments; j++) {
            /**
             * The index of the corner of the quadrilateral with the lowest value of i and j.
             * This corresponds to the smallest radius and smallest angle counterclockwise. 
             */
            var quadIndex = startLineIndex + j

            var v0 = quadIndex
            var v1 = quadIndex + thetaSegments + 1  // Move outwards one segment.
            var v2 = quadIndex + thetaSegments + 2  // Then move one segment along the radius.

            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [Vector3.copy(axis), Vector3.copy(axis), Vector3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()])

            v0 = quadIndex // Start at the same corner
            v1 = quadIndex + thetaSegments + 2 // Move diagonally outwards and along radial
            v2 = quadIndex + 1  // Then move radially inwards

            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [Vector3.copy(axis), Vector3.copy(axis), Vector3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()])
        }
    }
}

function makeLineSegments(vertices: Vector3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i < radialSegments; i++) {
        for (let j = 0; j < thetaSegments; j++) {
            let simplex = new Simplex(Simplex.LINE)
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)]
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j + 1, thetaSegments)]
            data.push(simplex)

            simplex = new Simplex(Simplex.LINE)
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)]
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, j, thetaSegments)]
            data.push(simplex)
        }
        // TODO: We probably don't need these lines when the thing is closed 
        const simplex = new Simplex(Simplex.LINE)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, thetaSegments, thetaSegments)]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, thetaSegments, thetaSegments)]
        data.push(simplex)
    }
    // Lines for the outermost circle.
    for (let j = 0; j < thetaSegments; j++) {
        var simplex = new Simplex(Simplex.LINE)
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j, thetaSegments)]
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j + 1, thetaSegments)]
        data.push(simplex)
    }
}

function makePoints(vertices: Vector3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i <= radialSegments; i++) {
        for (let j = 0; j <= thetaSegments; j++) {
            var simplex = new Simplex(Simplex.POINT)
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)]
            data.push(simplex)
        }
    }
}

function makeEmpty(vertices: Vector3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i <= radialSegments; i++) {
        for (let j = 0; j <= thetaSegments; j++) {
            var simplex = new Simplex(Simplex.EMPTY)
            data.push(simplex)
        }
    }
}

export default class RingSimplexGeometry extends SliceSimplexPrimitivesBuilder {
    public a: number;
    public b: number;
    constructor(a = 1, b = 0, axis?: VectorE3, sliceStart?: VectorE3, sliceAngle?: number) {
        super(axis, sliceStart, sliceAngle)
        this.a = a
        this.b = b
    }
    public isModified(): boolean {
        return super.isModified();
    }
    public regenerate(): void {
        this.data = []

        var radialSegments = this.flatSegments
        var thetaSegments = this.curvedSegments
        var generator: SpinorE3 = Spinor3.dual(this.axis)

        var vertices: Vector3[] = []
        var uvs: Vector2[] = []

        computeVertices(this.a, this.b, this.axis, this.sliceStart, this.sliceAngle, generator, radialSegments, thetaSegments, vertices, uvs)
        switch (this.k) {
            case Simplex.EMPTY: {
                makeEmpty(vertices, radialSegments, thetaSegments, this.data)
            }
                break
            case Simplex.POINT: {
                makePoints(vertices, radialSegments, thetaSegments, this.data)
            }
                break
            case Simplex.LINE: {
                makeLineSegments(vertices, radialSegments, thetaSegments, this.data)
            }
                break
            case Simplex.TRIANGLE: {
                makeTriangles(vertices, uvs, this.axis, radialSegments, thetaSegments, this)
            }
                break
            default: {
                console.warn(this.k + "-simplex is not supported for geometry generation.")
            }
        }

        this.setModified(false)
    }
    public setModified(modified: boolean): RingSimplexGeometry {
        super.setModified(modified)
        return this;
    }
}
