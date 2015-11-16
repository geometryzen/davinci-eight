import Euclidean3 = require('../math/Euclidean3')
import SimplexGeometry = require('../geometries/SimplexGeometry')
import Simplex = require('../geometries/Simplex')
import SliceSimplexGeometry = require('../geometries/SliceSimplexGeometry')
import Symbolic = require('../core/Symbolic')
import R2 = require('../math/R2')
import VectorE3 = require('../math/VectorE3')
import R3 = require('../math/R3')

/**
 * @class ConeSimplexGeometry
 * @extends SliceSimplexGeometry
 */
class ConeSimplexGeometry extends SliceSimplexGeometry {
    public radiusTop: number;
    public radius: number;
    public height: number;
    public openTop: boolean;
    public openBottom: boolean;
    public thetaStart: number;
    /**
     * @class ConeSimplexGeometry
     * @constructor
     * @param [radiusTop = 0.5] {number}
     * @param [radius = 0.5] {number}
     * @param [height = 1] {number}
     * @param [openTop = false] {boolean}
     * @param [openBottom = false] {boolean}
     * @param [thetaStart = 0] {number}
     */
    constructor(
        radius: number = 0.5,
        height: number = 1,
        axis: VectorE3,
        radiusTop: number = 0.0,
        openTop: boolean = false,
        openBottom: boolean = false,
        thetaStart: number = 0) {

        super(axis, void 0, void 0)
        this.radiusTop = radiusTop
        this.radius = radius
        this.height = height
        this.openTop = openTop
        this.openBottom = openBottom
        this.thetaStart = thetaStart
    }
    public regenerate(): void {
        let radiusBottom = this.radius
        let radiusTop = this.radiusTop
        let height = this.height
        let heightSegments = this.flatSegments
        let radialSegments = this.curvedSegments
        let openTop = this.openTop
        let openBottom = this.openBottom
        let thetaStart = this.thetaStart
        let sliceAngle = this.sliceAngle

        let heightHalf = height / 2;

        var x: number;
        var y: number;
        var points: R3[] = [];
        let vertices: number[][] = [];
        let uvs: R2[][] = [];

        for (y = 0; y <= heightSegments; y++) {
            let verticesRow: number[] = [];
            let uvsRow: R2[] = [];
            let v = y / heightSegments;
            let radius = v * (radiusBottom - radiusTop) + radiusTop;
            for (x = 0; x <= radialSegments; x++) {
                let u = x / radialSegments;
                let vertex = new R3();
                vertex.x = radius * Math.sin(u * sliceAngle + thetaStart);
                vertex.y = - v * height + heightHalf;
                vertex.z = radius * Math.cos(u * sliceAngle + thetaStart);
                points.push(vertex);
                verticesRow.push(points.length - 1);
                uvsRow.push(new R2([u, 1 - v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
        }

        let tanTheta = (radiusBottom - radiusTop) / height;
        var na: R3;
        var nb: R3;
        for (x = 0; x < radialSegments; x++) {
            if (radiusTop !== 0) {
                na = R3.copy(points[vertices[0][x]]);
                nb = R3.copy(points[vertices[0][x + 1]]);
            }
            else {
                na = R3.copy(points[vertices[1][x]]);
                nb = R3.copy(points[vertices[1][x + 1]]);
            }
            na.setY(Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta).direction();
            nb.setY(Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta).direction();
            for (y = 0; y < heightSegments; y++) {
                let v1: number = vertices[y][x];
                let v2: number = vertices[y + 1][x];
                let v3: number = vertices[y + 1][x + 1];
                let v4: number = vertices[y][x + 1];
                let n1 = na.clone();
                let n2 = na.clone();
                let n3 = nb.clone();
                let n4 = nb.clone();
                let uv1 = uvs[y][x].clone();
                let uv2 = uvs[y + 1][x].clone();
                let uv3 = uvs[y + 1][x + 1].clone();
                let uv4 = uvs[y][x + 1].clone();
                this.triangle([points[v1], points[v2], points[v4]], [n1, n2, n4], [uv1, uv2, uv4])
                this.triangle([points[v2], points[v3], points[v4]], [n2.clone(), n3, n4.clone()], [uv2.clone(), uv3, uv4.clone()])
            }
        }

        // top cap
        if (!openTop && radiusTop > 0) {
            points.push(R3.copy(Euclidean3.e2).scale(heightHalf));
            for (x = 0; x < radialSegments; x++) {
                let v1: number = vertices[0][x];
                let v2: number = vertices[0][x + 1];
                let v3: number = points.length - 1;
                let n1: R3 = R3.copy(Euclidean3.e2);
                let n2: R3 = R3.copy(Euclidean3.e2);
                let n3: R3 = R3.copy(Euclidean3.e2);
                let uv1: R2 = uvs[0][x].clone();
                let uv2: R2 = uvs[0][x + 1].clone();
                let uv3: R2 = new R2([uv2.x, 0]);
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }

        // bottom cap
        if (!openBottom && radiusBottom > 0) {
            points.push(R3.copy(Euclidean3.e2).scale(-heightHalf));
            for (x = 0; x < radialSegments; x++) {
                let v1: number = vertices[heightSegments][x + 1];
                let v2: number = vertices[heightSegments][x];
                let v3: number = points.length - 1;
                let n1: R3 = R3.copy(Euclidean3.e2).scale(-1);
                let n2: R3 = R3.copy(Euclidean3.e2).scale(-1);
                let n3: R3 = R3.copy(Euclidean3.e2).scale(-1);
                let uv1: R2 = uvs[heightSegments][x + 1].clone();
                let uv2: R2 = uvs[heightSegments][x].clone();
                let uv3: R2 = new R2([uv2.x, 1]);
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
}

export = ConeSimplexGeometry;
