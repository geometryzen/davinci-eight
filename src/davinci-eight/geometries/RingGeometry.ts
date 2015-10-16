import arc3 = require('../geometries/arc3')
import Cartesian3 = require('../math/Cartesian3')
import Geometry = require('../geometries/Geometry')
import mustBeNumber = require('../checks/mustBeNumber')
import Simplex = require('../geometries/Simplex')
import Spinor3 = require('../math/Spinor3')
import Spinor3Coords = require('../math/Spinor3Coords')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

// TODO: If the Ring is closed (angle = 2 * PI) then we get some redundancy at the join.
// TODO: If the innerRadius is zero then the quadrilaterals have degenerate triangles.
// TODO: May be more efficient to calculate points for the outer circle then scale them inwards.

/**
 * 
 */
function computeVertices(a: number, b: number, axis: Cartesian3, start: Cartesian3, angle: number, generator: Spinor3Coords, radialSegments: number, thetaSegments: number, vertices: Vector3[], uvs: Vector2[]) {
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

/**
 * Our traversal will generate the following mapping into the vertices and uvs arrays.
 * This is standard for two looping variables.
 */
function vertexIndex(i: number, j: number, thetaSegments: number): number {
    return i * (thetaSegments + 1) + j
}

function makeTriangles(vertices: Vector3[], uvs: Vector2[], axis: Vector3, radialSegments: number, thetaSegments: number, geometry: Geometry) {
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

            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [axis, axis, axis], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()])

            v0 = quadIndex // Start at the same corner
            v1 = quadIndex + thetaSegments + 2 // Move diagonally outwards and along radial
            v2 = quadIndex + 1  // Then move radially inwards

            geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [axis, axis, axis], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()])
        }
    }
}

function makeLineSegments(vertices: Vector3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i < radialSegments; i++) {
        for (let j = 0; j < thetaSegments; j++) {
            var simplex = new Simplex(Simplex.K_FOR_LINE_SEGMENT)
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)]
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j + 1, thetaSegments)]
            data.push(simplex)

            var simplex = new Simplex(Simplex.K_FOR_LINE_SEGMENT)
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)]
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, j, thetaSegments)]
            data.push(simplex)
        }
        // TODO: We probably don't need these lines when the thing is closed 
        var simplex = new Simplex(Simplex.K_FOR_LINE_SEGMENT)
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, thetaSegments, thetaSegments)]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, thetaSegments, thetaSegments)]
        data.push(simplex)
    }
    // Lines for the outermost circle.
    for (let j = 0; j < thetaSegments; j++) {
        var simplex = new Simplex(Simplex.K_FOR_LINE_SEGMENT)
        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j, thetaSegments)]
        simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j + 1, thetaSegments)]
        data.push(simplex)
    }
}

function makePoints(vertices: Vector3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i <= radialSegments; i++) {
        for (let j = 0; j <= thetaSegments; j++) {
            var simplex = new Simplex(Simplex.K_FOR_POINT)
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)]
            data.push(simplex)
        }
    }
}

function makeEmpty(vertices: Vector3[], radialSegments: number, thetaSegments: number, data: Simplex[]) {
    for (let i = 0; i <= radialSegments; i++) {
        for (let j = 0; j <= thetaSegments; j++) {
            var simplex = new Simplex(Simplex.K_FOR_EMPTY)
            data.push(simplex)
        }
    }
}

/**
 * @class RingGeometry
 * @extends Geometry
 */
class RingGeometry extends Geometry {
    /**
     * The inner radius.
     * @property innerRadius
     * @type {number}
     */
    public innerRadius: number;
    /**
     * The outer radius.
     * @property outerRadius
     * @type {number}
     */
    public outerRadius: number;
    /**
     * The axis of symmetry (unit vector) direction.
     * @property axis
     * @type {Vector3}
     */
    public axis: Vector3;
    /**
     * The direction (perpendicular to axis) of the start or the arc.
     * @property start
     * @type {Vector3}
     */
    public start: Vector3;
    /**
     * The angle subtended by the ring.
     */
    public angle: number;
    /**
     * The number of segments in the radial direction.
     */
    public radialSegments: number;
    /**
     * The number of segments in the angular direction.
     */
    public thetaSegments: number;
    /**
     * Creates an annulus with a single hole.
     * @class RingGeometry
     * @constructor
     * @param a [number = 1] The outer radius
     * @param b [number = 0] The inner radius
     * @param axis [Cartesian3 = Vector3.e3] The symmetry axis unit vector.
     * @param start [Cartesian3 = Vector3.e1] The direction of the start.
     * @param angle [number = 2 * Math.PI] The angle.
     */
    constructor(innerRadius: number = 0, outerRadius: number = 1, axis: Cartesian3 = Vector3.e3, start: Cartesian3 = Vector3.e1, angle: number = 2 * Math.PI) {
        super('RingGeometry')
        this.innerRadius = innerRadius
        this.outerRadius = outerRadius
        this.axis = Vector3.copy(axis).normalize()
        this.start = Vector3.copy(start).normalize()
        this.angle = mustBeNumber('angle', angle)
        this.radialSegments = 1
        this.thetaSegments = 32
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
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

        var radialSegments = this.radialSegments
        var thetaSegments = this.thetaSegments
        var generator: Spinor3Coords = new Spinor3().dual(this.axis)

        var vertices: Vector3[] = []
        var uvs: Vector2[] = []

        computeVertices(this.outerRadius, this.innerRadius, this.axis, this.start, this.angle, generator, radialSegments, thetaSegments, vertices, uvs)
        switch (this.k) {
            case Simplex.K_FOR_EMPTY: {
                makeEmpty(vertices, radialSegments, thetaSegments, this.data)
            }
                break
            case Simplex.K_FOR_POINT: {
                makePoints(vertices, radialSegments, thetaSegments, this.data)
            }
                break
            case Simplex.K_FOR_LINE_SEGMENT: {
                makeLineSegments(vertices, radialSegments, thetaSegments, this.data)
            }
                break
            case Simplex.K_FOR_TRIANGLE: {
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
     * @return {RingGeometry}
     * @chainable
     */
    public setModified(modified: boolean): RingGeometry {
        super.setModified(modified)
        return this;
    }
}

export = RingGeometry