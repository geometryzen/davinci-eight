import arc3 = require('../geometries/arc3')
import Cartesian3 = require('../math/Cartesian3')
import Geometry = require('../geometries/Geometry')
import mustBeNumber = require('../checks/mustBeNumber')
import MutableNumber = require('../math/MutableNumber')
import Simplex = require('../geometries/Simplex');
import SliceGeometry = require('../geometries/SliceGeometry')
import Sphere = require('../math/Sphere')
import Spinor3 = require('../math/Spinor3')
import Spinor3Coords = require('../math/Spinor3Coords')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

function computeVertices(radius: number, axis: Vector3, phiStart: Vector3, phiLength: number, thetaStart: number, thetaLength: number, heightSegments: number, widthSegments: number, points: Vector3[], uvs: Vector2[]) {

    let generator: Spinor3Coords = new Spinor3().dual(axis)
    let iLength = heightSegments + 1
    let jLength = widthSegments + 1

    for (var i = 0; i < iLength; i++) {
        var v = i / heightSegments;

        let theta = thetaStart + v * thetaLength
        let arcRadius = radius * Math.sin(theta)
        let begin = Vector3.copy(phiStart).scale(arcRadius)

        let arcPoints = arc3(begin, phiLength, generator, widthSegments)
        /**
         * Displacement that we need to add to each arc point to get the
         * distance position parallel to the axis correct.
         */
        let dispH = Vector3.copy(axis).scale(Math.cos(theta))

        for (var j = 0; j < jLength; j++) {
            var u = j / widthSegments;
            var point = arcPoints[j].add(dispH)
            points.push(point)
            uvs.push(new Vector2([u, 1 - v]))
        }
    }
}

function quadIndex(i: number, j: number, innerSegments: number): number {
    return i * (innerSegments + 1) + j
}

function vertexIndex(qIndex: number, n: number, innerSegments: number) {
    switch (n) {
        case 0: return qIndex + 1
        case 1: return qIndex
        case 2: return qIndex + innerSegments + 1
        case 3: return qIndex + innerSegments + 2
    }
}

function makeTriangles(points: Vector3[], uvs: Vector2[], radius: number, heightSegments: number, widthSegments: number, geometry: Geometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            // Form a quadrilateral. v0 through v3 give the indices into the points array.
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: Vector3 = Vector3.copy(points[v0]).normalize();
            var n1: Vector3 = Vector3.copy(points[v1]).normalize();
            var n2: Vector3 = Vector3.copy(points[v2]).normalize();
            var n3: Vector3 = Vector3.copy(points[v3]).normalize();

            // Grab the uv coordinates too.
            var uv0: Vector2 = uvs[v0].clone();
            var uv1: Vector2 = uvs[v1].clone();
            var uv2: Vector2 = uvs[v2].clone();
            var uv3: Vector2 = uvs[v3].clone();

            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            if (false/*Math.abs(points[v0].y) === radius*/) {
                uv0.x = (uv0.x + uv1.x) / 2;
                geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (false/*Math.abs(points[v2].y) === radius*/) {
                uv2.x = (uv2.x + uv3.x) / 2;
                geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
                // The other patches create two triangles.
                geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3])
                geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1])
            }
        }
    }
}

function makeLineSegments(points: Vector3[], uvs: Vector2[], radius: number, heightSegments: number, widthSegments: number, geometry: Geometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: Vector3 = Vector3.copy(points[v0]).normalize();
            var n1: Vector3 = Vector3.copy(points[v1]).normalize();
            var n2: Vector3 = Vector3.copy(points[v2]).normalize();
            var n3: Vector3 = Vector3.copy(points[v3]).normalize();

            // Grab the uv coordinates too.
            var uv0: Vector2 = uvs[v0].clone();
            var uv1: Vector2 = uvs[v1].clone();
            var uv2: Vector2 = uvs[v2].clone();
            var uv3: Vector2 = uvs[v3].clone();

            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            if (false/*Math.abs(points[v0].y) === radius*/) {
                uv0.x = (uv0.x + uv1.x) / 2;
                geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (false/*Math.abs(points[v2].y) === radius*/) {
                uv2.x = (uv2.x + uv3.x) / 2;
                geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
                geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1])
                geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2])
                geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3])
                geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0])
            }
        }
    }
}

function makePoints(points: Vector3[], uvs: Vector2[], radius: number, heightSegments: number, widthSegments: number, geometry: Geometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: Vector3 = Vector3.copy(points[v0]).normalize();
            var n1: Vector3 = Vector3.copy(points[v1]).normalize();
            var n2: Vector3 = Vector3.copy(points[v2]).normalize();
            var n3: Vector3 = Vector3.copy(points[v3]).normalize();

            // Grab the uv coordinates too.
            var uv0: Vector2 = uvs[v0].clone();
            var uv1: Vector2 = uvs[v1].clone();
            var uv2: Vector2 = uvs[v2].clone();
            var uv3: Vector2 = uvs[v3].clone();

            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            if (false/*Math.abs(points[v0].y) === radius*/) {
                uv0.x = (uv0.x + uv1.x) / 2;
                geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (false/*Math.abs(points[v2].y) === radius*/) {
                uv2.x = (uv2.x + uv3.x) / 2;
                geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
                geometry.point([points[v0]], [n0], [uv0])
                geometry.point([points[v1]], [n1], [uv1])
                geometry.point([points[v2]], [n2], [uv2])
                geometry.point([points[v3]], [n3], [uv3])
            }
        }
    }
}

/**
 * @class SphericalPolarGeometry
 * @extends SliceGeometry
 */
class SphericalPolarGeometry extends SliceGeometry {
    /**
     * @property _radius
     * @type {MutableNumber}
     * @private
     */
    public _radius: MutableNumber;
    /**
     * @property thetaLength
     * @type {number}
     */
    public thetaLength: number;
    /**
     * Defines a start angle relative to the <code>axis</code> property.
     * @property thetaStart
     * @type {number}
     */
    public thetaStart: number;
    /**
     * Constructs a geometry consisting of triangular simplices based on spherical coordinates.
     * @class SphericalPolarGeometry
     * @constructor
     * @param radius [number = 1]
     * @param axis [Cartesian3]
     * @param phiStart [Cartesian]
     * @param phiLength [number = 2 * Math.PI]
     * @param thetaStart [number]
     * @param thetaLength [number]
     */
    constructor(
        radius: number = 1,
        axis: Cartesian3,
        phiStart: Cartesian3,
        phiLength: number = 2 * Math.PI,
        thetaStart: number = 0,
        thetaLength: number = Math.PI
    ) {
        super('SphericalPolarGeometry', axis, phiStart, phiLength)
        this._radius = new MutableNumber([radius])
        this.thetaLength = thetaLength
        this.thetaStart = thetaStart

        this.setModified(true)
        this.regenerate()
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._radius = void 0
        super.destructor()
    }
    /**
     * @property radius
     * @type {number}
     */
    get radius(): number {
        return this._radius.x
    }
    set radius(radius: number) {
        this._radius.x = mustBeNumber('radius', radius)
    }
    /**
     * @property phiLength
     * @type {number}
     */
    get phiLength(): number {
        return this.sliceAngle
    }
    set phiLength(phiLength: number) {
        this.sliceAngle = phiLength
    }
    /**
     * Defines a start half-plane relative to the <code>axis</code> property.
     * @property phiStart
     * @type {Vector3}
     */
    get phiStart(): Vector3 {
        return this.sliceStart
    }
    set phiStart(phiStart: Vector3) {
        this.sliceStart.copy(phiStart)
    }
    /**
     * @method isModified
     * @return {boolean}
     */
    public isModified(): boolean {
        return this._radius.modified || super.isModified()
    }
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {SphericalPolarGeometry}
     * @chainable
     */
    public setModified(modified: boolean): SphericalPolarGeometry {
        super.setModified(modified)
        this._radius.modified = modified
        return this
    }
    /**
     * @method regenerate
     * @return {void}
     */
    public regenerate(): void {
        this.data = []

        let heightSegments = this.curvedSegments
        let widthSegments = this.curvedSegments

        // Output. Could this be {[name:string]:VertexN<number>}[]
        var points: Vector3[] = []
        var uvs: Vector2[] = []
        computeVertices(this.radius, this.axis, this.phiStart, this.phiLength, this.thetaStart, this.thetaLength, heightSegments, widthSegments, points, uvs)

        switch (this.k) {
            case Simplex.K_FOR_EMPTY: {
              makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this)
            }
                break
            case Simplex.K_FOR_POINT: {
              makePoints(points, uvs, this.radius, heightSegments, widthSegments, this)
            }
                break
            case Simplex.K_FOR_LINE_SEGMENT: {
              makeLineSegments(points, uvs, this.radius, heightSegments, widthSegments, this)
            }
                break
            case Simplex.K_FOR_TRIANGLE: {
              makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this)
            }
                break
            default: {
                console.warn(this.k + "-simplex is not supported for geometry generation.")
            }
        }

        this.setModified(false)
    }
}

export = SphericalPolarGeometry;
