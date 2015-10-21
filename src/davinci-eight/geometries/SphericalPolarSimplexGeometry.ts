import arc3 = require('../geometries/arc3')
import VectorE3 = require('../math/VectorE3')
import SimplexGeometry = require('../geometries/SimplexGeometry')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import mustBeNumber = require('../checks/mustBeNumber')
import MutableNumber = require('../math/MutableNumber')
import Simplex = require('../geometries/Simplex');
import SliceSimplexGeometry = require('../geometries/SliceSimplexGeometry')
import Sphere = require('../math/Sphere')
import MutableSpinorE3 = require('../math/MutableSpinorE3')
import SpinorE3 = require('../math/SpinorE3')
import Symbolic = require('../core/Symbolic')
import MutableVectorE2 = require('../math/MutableVectorE2')
import MutableVectorE3 = require('../math/MutableVectorE3')

function computeVertices(radius: number, axis: MutableVectorE3, phiStart: MutableVectorE3, phiLength: number, thetaStart: number, thetaLength: number, heightSegments: number, widthSegments: number, points: MutableVectorE3[], uvs: MutableVectorE2[]) {

    let generator: SpinorE3 = new MutableSpinorE3().dual(axis)
    let iLength = heightSegments + 1
    let jLength = widthSegments + 1

    for (var i = 0; i < iLength; i++) {
        var v = i / heightSegments;

        let θ = thetaStart + v * thetaLength
        let arcRadius = radius * Math.sin(θ)
        let begin = MutableVectorE3.copy(phiStart).scale(arcRadius)

        let arcPoints = arc3(begin, phiLength, generator, widthSegments)
        /**
         * Displacement that we need to add to each arc point to get the
         * distance position parallel to the axis correct.
         */
        let cosθ = Math.cos(θ)

        for (var j = 0; j < jLength; j++) {
            var u = j / widthSegments;
            var point = arcPoints[j].add(axis, cosθ)
            points.push(point)
            uvs.push(new MutableVectorE2([u, 1 - v]))
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

function makeTriangles(points: MutableVectorE3[], uvs: MutableVectorE2[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexGeometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            // Form a quadrilateral. v0 through v3 give the indices into the points array.
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: MutableVectorE3 = MutableVectorE3.copy(points[v0]).normalize();
            var n1: MutableVectorE3 = MutableVectorE3.copy(points[v1]).normalize();
            var n2: MutableVectorE3 = MutableVectorE3.copy(points[v2]).normalize();
            var n3: MutableVectorE3 = MutableVectorE3.copy(points[v3]).normalize();

            // Grab the uv coordinates too.
            var uv0: MutableVectorE2 = uvs[v0].clone();
            var uv1: MutableVectorE2 = uvs[v1].clone();
            var uv2: MutableVectorE2 = uvs[v2].clone();
            var uv3: MutableVectorE2 = uvs[v3].clone();

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

function makeLineSegments(points: MutableVectorE3[], uvs: MutableVectorE2[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexGeometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: MutableVectorE3 = MutableVectorE3.copy(points[v0]).normalize();
            var n1: MutableVectorE3 = MutableVectorE3.copy(points[v1]).normalize();
            var n2: MutableVectorE3 = MutableVectorE3.copy(points[v2]).normalize();
            var n3: MutableVectorE3 = MutableVectorE3.copy(points[v3]).normalize();

            // Grab the uv coordinates too.
            var uv0: MutableVectorE2 = uvs[v0].clone();
            var uv1: MutableVectorE2 = uvs[v1].clone();
            var uv2: MutableVectorE2 = uvs[v2].clone();
            var uv3: MutableVectorE2 = uvs[v3].clone();

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

function makePoints(points: MutableVectorE3[], uvs: MutableVectorE2[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexGeometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: MutableVectorE3 = MutableVectorE3.copy(points[v0]).normalize();
            var n1: MutableVectorE3 = MutableVectorE3.copy(points[v1]).normalize();
            var n2: MutableVectorE3 = MutableVectorE3.copy(points[v2]).normalize();
            var n3: MutableVectorE3 = MutableVectorE3.copy(points[v3]).normalize();

            // Grab the uv coordinates too.
            var uv0: MutableVectorE2 = uvs[v0].clone();
            var uv1: MutableVectorE2 = uvs[v1].clone();
            var uv2: MutableVectorE2 = uvs[v2].clone();
            var uv3: MutableVectorE2 = uvs[v3].clone();

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
 * @class SphericalPolarSimplexGeometry
 * @extends SliceSimplexGeometry
 */
class SphericalPolarSimplexGeometry extends SliceSimplexGeometry implements IAxialGeometry<SphericalPolarSimplexGeometry> {
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
     * @class SphericalPolarSimplexGeometry
     * @constructor
     * @param radius [number = 1]
     * @param axis [VectorE3]
     * @param phiStart [vectorE3]
     * @param phiLength [number = 2 * Math.PI]
     * @param thetaStart [number]
     * @param thetaLength [number]
     */
    constructor(
        radius: number = 1,
        axis: VectorE3,
        phiStart: VectorE3,
        phiLength: number = 2 * Math.PI,
        thetaStart: number = 0,
        thetaLength: number = Math.PI
    ) {
        super('SphericalPolarSimplexGeometry', axis, phiStart, phiLength)
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
     * @type {MutableVectorE3}
     */
    get phiStart(): MutableVectorE3 {
        return this.sliceStart
    }
    set phiStart(phiStart: MutableVectorE3) {
        this.sliceStart.copy(phiStart)
    }
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {SphericalPolarSimplexGeometry}
     * @chainable
     */
    public setAxis(axis: VectorE3): SphericalPolarSimplexGeometry {
        super.setAxis(axis)
        return this
    }
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {SphericalPolarSimplexGeometry}
     * @chainable
     */
    public setPosition(position: VectorE3): SphericalPolarSimplexGeometry {
        super.setPosition(position)
        return this
    }
    public enableTextureCoords(enable: boolean): SphericalPolarSimplexGeometry {
        super.enableTextureCoords(enable)
        return this
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
     * @return {SphericalPolarSimplexGeometry}
     * @chainable
     */
    public setModified(modified: boolean): SphericalPolarSimplexGeometry {
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
        var points: MutableVectorE3[] = []
        var uvs: MutableVectorE2[] = []
        computeVertices(this.radius, this.axis, this.phiStart, this.phiLength, this.thetaStart, this.thetaLength, heightSegments, widthSegments, points, uvs)

        switch (this.k) {
            case Simplex.EMPTY: {
                makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this)
            }
                break
            case Simplex.POINT: {
                makePoints(points, uvs, this.radius, heightSegments, widthSegments, this)
            }
                break
            case Simplex.LINE: {
                makeLineSegments(points, uvs, this.radius, heightSegments, widthSegments, this)
            }
                break
            case Simplex.TRIANGLE: {
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

export = SphericalPolarSimplexGeometry;
