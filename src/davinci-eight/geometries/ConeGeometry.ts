import Geometry = require('../geometries/Geometry');
import Simplex = require('../geometries/Simplex');
import Symbolic = require('../core/Symbolic');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

/**
 * @class ConeGeometry
 */
class ConeGeometry extends Geometry {
    public radiusTop: number;
    public radiusBottom: number;
    public height: number;
    public heightSegments: number;
    public radialSegments: number;
    public openTop: boolean;
    public openBottom: boolean;
    public thetaStart: number;
    public thetaLength: number;
    /**
     * @class ConeGeometry
     * @constructor
     * @param radiusTop [number = 0.5]
     * @param radiusBottom [number = 0.5]
     * @param height [number = 1]
     * @param radialSegments [number = 16]
     * @param heightSegments [number = 1]
     * @param openTop [boolean = false]
     * @param openBottom [boolean = false]
     * @param thetaStart [number = 0]
     * @param thetaLength [number = 2 * Math.PI]
     */
    constructor(
        radiusTop: number = 0.5,
        radiusBottom: number = 0.5,
        height: number = 1,
        radialSegments: number = 16,
        heightSegments: number = 1,
        openTop: boolean = false,
        openBottom: boolean = false,
        thetaStart: number = 0,
        thetaLength: number = 2 * Math.PI) {

        radialSegments = Math.max(radialSegments, 3);
        heightSegments = Math.max(heightSegments, 1);

        super('ConeGeometry')
        this.radiusTop = radiusTop
        this.radiusBottom = radiusBottom
        this.height = height
        this.radialSegments = radialSegments
        this.heightSegments = heightSegments
        this.openTop = openTop
        this.openBottom = openBottom
        this.thetaStart = thetaStart
        this.thetaLength = thetaLength
    }
    public regenerate(): void {
        let radiusBottom = this.radiusBottom
        let radiusTop = this.radiusTop
        let height = this.height
        let heightSegments = this.heightSegments
        let radialSegments = this.radialSegments
        let openTop = this.openTop
        let openBottom = this.openBottom
        let thetaStart = this.thetaStart
        let thetaLength = this.thetaLength


        let heightHalf = height / 2;

        var x: number;
        var y: number;
        var points: Vector3[] = [];
        let vertices: number[][] = [];
        let uvs: Vector2[][] = [];

        for (y = 0; y <= heightSegments; y++) {
            let verticesRow: number[] = [];
            let uvsRow: Vector2[] = [];
            let v = y / heightSegments;
            let radius = v * (radiusBottom - radiusTop) + radiusTop;
            for (x = 0; x <= radialSegments; x++) {
                let u = x / radialSegments;
                let vertex = new Vector3();
                vertex.x = radius * Math.sin(u * thetaLength + thetaStart);
                vertex.y = - v * height + heightHalf;
                vertex.z = radius * Math.cos(u * thetaLength + thetaStart);
                points.push(vertex);
                verticesRow.push(points.length - 1);
                uvsRow.push(new Vector2([u, 1 - v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
        }

        let tanTheta = (radiusBottom - radiusTop) / height;
        var na: Vector3;
        var nb: Vector3;
        for (x = 0; x < radialSegments; x++) {
            if (radiusTop !== 0) {
                na = Vector3.copy(points[vertices[0][x]]);
                nb = Vector3.copy(points[vertices[0][x + 1]]);
            }
            else {
                na = Vector3.copy(points[vertices[1][x]]);
                nb = Vector3.copy(points[vertices[1][x + 1]]);
            }
            na.setY(Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta).normalize();
            nb.setY(Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta).normalize();
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
            points.push(Vector3.e2.clone().scale(heightHalf));
            for (x = 0; x < radialSegments; x++) {
                let v1: number = vertices[0][x];
                let v2: number = vertices[0][x + 1];
                let v3: number = points.length - 1;
                let n1: Vector3 = Vector3.e2.clone();
                let n2: Vector3 = Vector3.e2.clone();
                let n3: Vector3 = Vector3.e2.clone();
                let uv1: Vector2 = uvs[0][x].clone();
                let uv2: Vector2 = uvs[0][x + 1].clone();
                let uv3: Vector2 = new Vector2([uv2.x, 0]);
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }

        // bottom cap
        if (!openBottom && radiusBottom > 0) {
            points.push(Vector3.e2.clone().scale(-heightHalf));
            for (x = 0; x < radialSegments; x++) {
                let v1: number = vertices[heightSegments][x + 1];
                let v2: number = vertices[heightSegments][x];
                let v3: number = points.length - 1;
                let n1: Vector3 = Vector3.e2.clone().scale(-1);
                let n2: Vector3 = Vector3.e2.clone().scale(-1);
                let n3: Vector3 = Vector3.e2.clone().scale(-1);
                let uv1: Vector2 = uvs[heightSegments][x + 1].clone();
                let uv2: Vector2 = uvs[heightSegments][x].clone();
                let uv3: Vector2 = new Vector2([uv2.x, 1]);
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
}

export = ConeGeometry;
