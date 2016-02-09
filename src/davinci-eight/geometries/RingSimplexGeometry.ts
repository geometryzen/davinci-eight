import arc3 from '../geometries/arc3';
import CartesianE3 from '../math/CartesianE3';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import Simplex from '../geometries/Simplex';
import SliceSimplexGeometry from '../geometries/SliceSimplexGeometry';
import SpinG3 from '../math/SpinG3';
import SpinorE3 from '../math/SpinorE3';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import R2 from '../math/R2';
import R3 from '../math/R3';
import VectorE3 from '../math/VectorE3';

/**
 * @module EIGHT
 * @submodule geometries
 */

// TODO: If the Ring is closed (angle = 2 * PI) then we get some redundancy at the join.
// TODO: If the innerRadius is zero then the quadrilaterals have degenerate triangles.
// TODO: May be more efficient to calculate points for the outer circle then scale them inwards.

/**
 * 
 */
function computeVertices(a: number, b: number, axis: CartesianE3, start: VectorE3, angle: number, generator: SpinorE3, radialSegments: number, thetaSegments: number, vertices: R3[], uvs: R2[]) {
    /**
     * `t` is the vector perpendicular to s in the plane of the ring.
     * We could use the generator an PI / 4 to calculate this or the cross product as here.
     */
    var perp = R3.copy(axis).cross(start)
    /**
     * The distance of the vertex from the origin and center.
     */
    var radius = b
    var radiusStep = (a - b) / radialSegments

    for (var i = 0; i < radialSegments + 1; i++) {
        var begin = R3.copy(start).scale(radius)
        var arcPoints = arc3(begin, angle, generator, thetaSegments)
        for (var j = 0, jLength = arcPoints.length; j < jLength; j++) {
            var arcPoint = arcPoints[j]
            vertices.push(arcPoint)
            // The coordinates vary between -a and +a, which we map to 0 and 1.
            uvs.push(new R2([(arcPoint.dot(start) / a + 1) / 2, (arcPoint.dot(perp) / a + 1) / 2]))
        }
        radius += radiusStep;
    }
}

/**
 * Our traversal will generate the following mapping into the vertices and uvs arrays.
 * This is standard for two looping variables.
 */
function vertexIndex(i: number, j: number, thetaSegments: number): number {
    return i * (thetaSegments + 1) + j
}

function makeTriangles(vertices: R3[], uvs: R2[], axis: CartesianE3, radialSegments: number, thetaSegments: number, geometry: SimplexPrimitivesBuilder) {
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

            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [R3.copy(axis), R3.copy(axis), R3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()])

            v0 = quadIndex // Start at the same corner
            v1 = quadIndex + thetaSegments + 2 // Move diagonally outwards and along radial
            v2 = quadIndex + 1  // Then move radially inwards

            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [R3.copy(axis), R3.copy(axis), R3.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()])
        }
    }
}

function makeLineSegments(vertices: R3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
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

function makePoints(vertices: R3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i <= radialSegments; i++) {
        for (let j = 0; j <= thetaSegments; j++) {
            var simplex = new Simplex(Simplex.POINT)
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)]
            data.push(simplex)
        }
    }
}

function makeEmpty(vertices: R3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i <= radialSegments; i++) {
        for (let j = 0; j <= thetaSegments; j++) {
            var simplex = new Simplex(Simplex.EMPTY)
            data.push(simplex)
        }
    }
}

/**
 * @class RingSimplexGeometry
 * @extends SliceSimplexGeometry
 */
export default class RingSimplexGeometry extends SliceSimplexGeometry {
    /**
     * The outer radius.
     * @property a
     * @type {number}
     */
    public a: number;
    /**
     * The inner radius.
     * @property b
     * @type {number}
     */
    public b: number;
    /**
     * <p>
     * Creates an annulus with a single hole.
     * </p>
     * <p>
     * Sets the <code>sliceAngle</code> property to <code>2 * Math.PI</p>.
     * </p>
     * @class RingSimplexGeometry
     * @constructor
     * @param [a = 1] {number} The outer radius
     * @param [b = 0] {number} The inner radius
     * @param [axis] {VectorE3} The <code>axis</code> property.
     * @param [sliceStart] {VectorE3} The <code>sliceStart</code> property.
     * @param [sliceAngle] {number} The <code>sliceAngle</code> property.
     */
    constructor(a = 1, b = 0, axis?: VectorE3, sliceStart?: VectorE3, sliceAngle?: number) {
        super(axis, sliceStart, sliceAngle)
        this.a = a
        this.b = b
    }

    /**
     * @method isModified
     * @return {boolean}
     */
    public isModified(): boolean {
        return super.isModified();
    }
    /**
     * @method regenerate
     * @return {void}
     */
    public regenerate(): void {
        this.data = []

        var radialSegments = this.flatSegments
        var thetaSegments = this.curvedSegments
        var generator: SpinorE3 = SpinG3.dual(this.axis)

        var vertices: R3[] = []
        var uvs: R2[] = []

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
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {RingSimplexGeometry}
     * @chainable
     */
    public setModified(modified: boolean): RingSimplexGeometry {
        super.setModified(modified)
        return this;
    }
}
