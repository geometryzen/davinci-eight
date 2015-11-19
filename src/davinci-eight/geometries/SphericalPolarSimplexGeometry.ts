import arc3 = require('../geometries/arc3')
import CartesianE3 = require('../math/CartesianE3')
import SimplexGeometry = require('../geometries/SimplexGeometry')
import IAxialGeometry = require('../geometries/IAxialGeometry')
import mustBeNumber = require('../checks/mustBeNumber')
import R1 = require('../math/R1')
import Simplex = require('../geometries/Simplex');
import SliceSimplexGeometry = require('../geometries/SliceSimplexGeometry')
import Sphere = require('../math/Sphere')
import SpinG3 = require('../math/SpinG3')
import SpinorE3 = require('../math/SpinorE3')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')
import R2 = require('../math/R2')
import R3 = require('../math/R3')
import VectorE3 = require('../math/VectorE3')

function computeVertices(radius: number, axis: CartesianE3, phiStart: R3, phiLength: number, thetaStart: number, thetaLength: number, heightSegments: number, widthSegments: number, points: R3[], uvs: R2[]) {

    let generator: SpinorE3 = SpinG3.dual(axis)
    let iLength = heightSegments + 1
    let jLength = widthSegments + 1

    for (var i = 0; i < iLength; i++) {
        var v = i / heightSegments;

        let θ = thetaStart + v * thetaLength
        let arcRadius = radius * Math.sin(θ)
        let begin = R3.copy(phiStart).scale(arcRadius)

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
            uvs.push(new R2([u, 1 - v]))
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

function makeTriangles(points: R3[], uvs: R2[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexGeometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            // Form a quadrilateral. v0 through v3 give the indices into the points array.
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: R3 = R3.copy(points[v0]).direction();
            var n1: R3 = R3.copy(points[v1]).direction();
            var n2: R3 = R3.copy(points[v2]).direction();
            var n3: R3 = R3.copy(points[v3]).direction();

            // Grab the uv coordinates too.
            var uv0: R2 = uvs[v0].clone();
            var uv1: R2 = uvs[v1].clone();
            var uv2: R2 = uvs[v2].clone();
            var uv3: R2 = uvs[v3].clone();

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

function makeLineSegments(points: R3[], uvs: R2[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexGeometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: R3 = R3.copy(points[v0]).direction();
            var n1: R3 = R3.copy(points[v1]).direction();
            var n2: R3 = R3.copy(points[v2]).direction();
            var n3: R3 = R3.copy(points[v3]).direction();

            // Grab the uv coordinates too.
            var uv0: R2 = uvs[v0].clone();
            var uv1: R2 = uvs[v1].clone();
            var uv2: R2 = uvs[v2].clone();
            var uv3: R2 = uvs[v3].clone();

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

function makePoints(points: R3[], uvs: R2[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexGeometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: R3 = R3.copy(points[v0]).direction();
            var n1: R3 = R3.copy(points[v1]).direction();
            var n2: R3 = R3.copy(points[v2]).direction();
            var n3: R3 = R3.copy(points[v3]).direction();

            // Grab the uv coordinates too.
            var uv0: R2 = uvs[v0].clone();
            var uv1: R2 = uvs[v1].clone();
            var uv2: R2 = uvs[v2].clone();
            var uv3: R2 = uvs[v3].clone();

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
     * @type {R1}
     * @private
     */
    public _radius: R1;
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
     * @param [radius = 1] {number}
     * @param [axis] {VectorE3}
     * @param [phiStart] {vectorE3}
     * @param [phiLength = 2 * Math.PI] {number}
     * @param [thetaStart = 0] {number}
     * @param [thetaLength = Math.PI] {number}
     */
    constructor(
        radius: number = 1,
        axis: VectorE3,
        phiStart?: VectorE3,
        phiLength: number = 2 * Math.PI,
        thetaStart: number = 0,
        thetaLength: number = Math.PI
    ) {
        super(axis, phiStart, phiLength)
        this._radius = new R1([radius])
        this.thetaLength = thetaLength
        this.thetaStart = thetaStart

        this.setModified(true)
        this.regenerate()
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
     * @type {R3}
     */
    get phiStart(): R3 {
        return this.sliceStart
    }
    set phiStart(phiStart: R3) {
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
        var points: R3[] = []
        var uvs: R2[] = []
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
