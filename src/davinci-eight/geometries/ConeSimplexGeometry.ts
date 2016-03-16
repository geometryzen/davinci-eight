import G3 from '../math/G3';
import SliceSimplexPrimitivesBuilder from '../geometries/SliceSimplexPrimitivesBuilder';
import Vector2 from '../math/Vector2';
import VectorE3 from '../math/VectorE3';
import Vector3 from '../math/Vector3';

export default class ConeSimplexGeometry extends SliceSimplexPrimitivesBuilder {
    public radiusTop: number;
    public radius: number;
    public height: number;
    public openCap: boolean;
    public openBase: boolean;
    public thetaStart: number;
    constructor(
        radius = 0.5,
        height = 1,
        axis: VectorE3,
        radiusTop = 0.0,
        openCap = false,
        openBase = false,
        thetaStart = 0) {

        super()
        this.radiusTop = radiusTop
        this.radius = radius
        this.height = height
        this.openCap = openCap
        this.openBase = openBase
        this.thetaStart = thetaStart
    }

    protected regenerate(): void {
        let radiusBottom = this.radius
        let radiusTop = this.radiusTop
        let height = this.height
        let heightSegments = this.flatSegments
        let radialSegments = this.curvedSegments
        let openCap = this.openCap
        let openBase = this.openBase
        let thetaStart = this.thetaStart
        let sliceAngle = this.sliceAngle

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
                vertex.x = radius * Math.sin(u * sliceAngle + thetaStart);
                vertex.y = - v * height + heightHalf;
                vertex.z = radius * Math.cos(u * sliceAngle + thetaStart);
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

            na.y = Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta
            na.normalize()

            nb.y = Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta
            nb.normalize()

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
        if (!openCap && radiusTop > 0) {
            points.push(Vector3.copy(G3.e2).scale(heightHalf));
            for (x = 0; x < radialSegments; x++) {
                let v1: number = vertices[0][x];
                let v2: number = vertices[0][x + 1];
                let v3: number = points.length - 1;
                let n1: Vector3 = Vector3.copy(G3.e2);
                let n2: Vector3 = Vector3.copy(G3.e2);
                let n3: Vector3 = Vector3.copy(G3.e2);
                let uv1: Vector2 = uvs[0][x].clone();
                let uv2: Vector2 = uvs[0][x + 1].clone();
                let uv3: Vector2 = new Vector2([uv2.x, 0]);
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }

        // bottom cap
        if (!openBase && radiusBottom > 0) {
            points.push(Vector3.copy(G3.e2).scale(-heightHalf));
            for (x = 0; x < radialSegments; x++) {
                let v1: number = vertices[heightSegments][x + 1];
                let v2: number = vertices[heightSegments][x];
                let v3: number = points.length - 1;
                let n1: Vector3 = Vector3.copy(G3.e2).scale(-1);
                let n2: Vector3 = Vector3.copy(G3.e2).scale(-1);
                let n3: Vector3 = Vector3.copy(G3.e2).scale(-1);
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
