import arc3 from '../geometries/arc3';
import R3 from '../math/R3';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import IAxialGeometry from '../geometries/IAxialGeometry';
import mustBeNumber from '../checks/mustBeNumber';
import R1m from '../math/R1m';
import Simplex from '../geometries/Simplex';
import SliceSimplexPrimitivesBuilder from '../geometries/SliceSimplexPrimitivesBuilder';
import SpinG3m from '../math/SpinG3m';
import SpinorE3 from '../math/SpinorE3';
import R2m from '../math/R2m';
import R3m from '../math/R3m';
import VectorE3 from '../math/VectorE3';

function computeVertices(radius: number, axis: R3, phiStart: R3m, phiLength: number, thetaStart: number, thetaLength: number, heightSegments: number, widthSegments: number, points: R3m[], uvs: R2m[]) {

    const generator: SpinorE3 = SpinG3m.dual(axis)
    const iLength = heightSegments + 1
    const jLength = widthSegments + 1

    for (let i = 0; i < iLength; i++) {
        const v = i / heightSegments;

        const θ: number = thetaStart + v * thetaLength
        const arcRadius = radius * Math.sin(θ)
        const begin = R3m.copy(phiStart).scale(arcRadius)

        const arcPoints: R3m[] = arc3(begin, phiLength, generator, widthSegments)
        /**
         * Displacement that we need to add (in the axis direction) to each arc point to get the
         * distance position parallel to the axis correct.
         */
        const cosθ = Math.cos(θ)
        const displacement = radius * cosθ

        for (let j = 0; j < jLength; j++) {
            const point = arcPoints[j].add(axis, displacement)
            points.push(point)
            const u = j / widthSegments;
            uvs.push(new R2m([u, 1 - v]))
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

function makeTriangles(points: R3m[], uvs: R2m[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexPrimitivesBuilder) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            // Form a quadrilateral. v0 through v3 give the indices into the points array.
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: R3m = R3m.copy(points[v0]).direction();
            var n1: R3m = R3m.copy(points[v1]).direction();
            var n2: R3m = R3m.copy(points[v2]).direction();
            var n3: R3m = R3m.copy(points[v3]).direction();

            // Grab the uv coordinates too.
            var uv0: R2m = uvs[v0].clone();
            var uv1: R2m = uvs[v1].clone();
            var uv2: R2m = uvs[v2].clone();
            var uv3: R2m = uvs[v3].clone();

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

function makeLineSegments(points: R3m[], uvs: R2m[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexPrimitivesBuilder) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: R3m = R3m.copy(points[v0]).direction();
            var n1: R3m = R3m.copy(points[v1]).direction();
            var n2: R3m = R3m.copy(points[v2]).direction();
            var n3: R3m = R3m.copy(points[v3]).direction();

            // Grab the uv coordinates too.
            var uv0: R2m = uvs[v0].clone();
            var uv1: R2m = uvs[v1].clone();
            var uv2: R2m = uvs[v2].clone();
            var uv3: R2m = uvs[v3].clone();

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

function makePoints(points: R3m[], uvs: R2m[], radius: number, heightSegments: number, widthSegments: number, geometry: SimplexPrimitivesBuilder) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            let qIndex = quadIndex(i, j, widthSegments)
            var v0: number = vertexIndex(qIndex, 0, widthSegments)
            var v1: number = vertexIndex(qIndex, 1, widthSegments)
            var v2: number = vertexIndex(qIndex, 2, widthSegments)
            var v3: number = vertexIndex(qIndex, 3, widthSegments)

            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0: R3m = R3m.copy(points[v0]).direction();
            var n1: R3m = R3m.copy(points[v1]).direction();
            var n2: R3m = R3m.copy(points[v2]).direction();
            var n3: R3m = R3m.copy(points[v3]).direction();

            // Grab the uv coordinates too.
            var uv0: R2m = uvs[v0].clone();
            var uv1: R2m = uvs[v1].clone();
            var uv2: R2m = uvs[v2].clone();
            var uv3: R2m = uvs[v3].clone();

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

export default class SphereBuilder extends SliceSimplexPrimitivesBuilder implements IAxialGeometry<SphereBuilder> {
    public _radius: R1m;
    public thetaLength: number;
    public thetaStart: number;
    constructor(
        radius: number,
        axis: VectorE3,
        phiStart?: VectorE3,
        phiLength = 2 * Math.PI,
        thetaStart = 0,
        thetaLength = Math.PI
    ) {
        super(axis, phiStart, phiLength)
        this._radius = new R1m([radius])
        this.thetaLength = thetaLength
        this.thetaStart = thetaStart

        this.setModified(true)
        this.regenerate()
    }
    get radius(): number {
        return this._radius.x
    }
    set radius(radius: number) {
        this._radius.x = mustBeNumber('radius', radius)
    }
    get phiLength(): number {
        return this.sliceAngle
    }
    set phiLength(phiLength: number) {
        this.sliceAngle = phiLength
    }
    get phiStart(): R3m {
        return this.sliceStart
    }
    set phiStart(phiStart: R3m) {
        this.sliceStart.copy(phiStart)
    }
    public setAxis(axis: VectorE3): SphereBuilder {
        super.setAxis(axis)
        return this
    }
    public setPosition(position: VectorE3): SphereBuilder {
        super.setPosition(position)
        return this
    }
    public enableTextureCoords(enable: boolean): SphereBuilder {
        super.enableTextureCoords(enable)
        return this
    }
    public isModified(): boolean {
        return this._radius.modified || super.isModified()
    }
    public setModified(modified: boolean): SphereBuilder {
        super.setModified(modified)
        this._radius.modified = modified
        return this
    }
    public regenerate(): void {
        this.data = []

        let heightSegments = this.curvedSegments
        let widthSegments = this.curvedSegments

        // Output. Could this be {[name:string]:VertexN<number>}[]
        var points: R3m[] = []
        var uvs: R2m[] = []
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
