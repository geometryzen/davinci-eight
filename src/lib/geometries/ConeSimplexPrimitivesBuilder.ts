import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
import { SliceSimplexPrimitivesBuilder } from './SliceSimplexPrimitivesBuilder';

/**
 * @hidden
 */
export class ConeSimplexPrimitivesBuilder extends SliceSimplexPrimitivesBuilder {
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

        super();
        this.radiusTop = radiusTop;
        this.radius = radius;
        this.height = height;
        this.openCap = openCap;
        this.openBase = openBase;
        this.thetaStart = thetaStart;
    }

    protected regenerate(): void {
        const radiusBottom = this.radius;
        const radiusTop = this.radiusTop;
        const height = this.height;
        const heightSegments = this.flatSegments;
        const radialSegments = this.curvedSegments;
        const openCap = this.openCap;
        const openBase = this.openBase;
        const thetaStart = this.thetaStart;
        const sliceAngle = this.sliceAngle;

        const heightHalf = height / 2;

        let x: number;
        let y: number;
        const points: Vector3[] = [];
        const vertices: number[][] = [];
        const uvs: Vector2[][] = [];

        for (y = 0; y <= heightSegments; y++) {
            const verticesRow: number[] = [];
            const uvsRow: Vector2[] = [];
            const v = y / heightSegments;
            const radius = v * (radiusBottom - radiusTop) + radiusTop;
            for (x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const vertex = new Vector3();
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

        const tanTheta = (radiusBottom - radiusTop) / height;
        let na: Vector3;
        let nb: Vector3;
        for (x = 0; x < radialSegments; x++) {
            if (radiusTop !== 0) {
                na = Vector3.copy(points[vertices[0][x]]);
                nb = Vector3.copy(points[vertices[0][x + 1]]);
            }
            else {
                na = Vector3.copy(points[vertices[1][x]]);
                nb = Vector3.copy(points[vertices[1][x + 1]]);
            }

            na.y = Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta;
            na.normalize();

            nb.y = Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta;
            nb.normalize();

            for (y = 0; y < heightSegments; y++) {
                const v1: number = vertices[y][x];
                const v2: number = vertices[y + 1][x];
                const v3: number = vertices[y + 1][x + 1];
                const v4: number = vertices[y][x + 1];
                const n1 = na.clone();
                const n2 = na.clone();
                const n3 = nb.clone();
                const n4 = nb.clone();
                const uv1 = uvs[y][x].clone();
                const uv2 = uvs[y + 1][x].clone();
                const uv3 = uvs[y + 1][x + 1].clone();
                const uv4 = uvs[y][x + 1].clone();
                this.triangle([points[v1], points[v2], points[v4]], [n1, n2, n4], [uv1, uv2, uv4]);
                this.triangle([points[v2], points[v3], points[v4]], [n2.clone(), n3, n4.clone()], [uv2.clone(), uv3, uv4.clone()]);
            }
        }

        // top cap
        if (!openCap && radiusTop > 0) {
            points.push(Vector3.vector(0, 1, 0).scale(heightHalf));
            for (x = 0; x < radialSegments; x++) {
                const v1: number = vertices[0][x];
                const v2: number = vertices[0][x + 1];
                const v3: number = points.length - 1;
                const n1: Vector3 = Vector3.vector(0, 1, 0);
                const n2: Vector3 = Vector3.vector(0, 1, 0);
                const n3: Vector3 = Vector3.vector(0, 1, 0);
                const uv1: Vector2 = uvs[0][x].clone();
                const uv2: Vector2 = uvs[0][x + 1].clone();
                const uv3: Vector2 = new Vector2([uv2.x, 0]);
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
        }

        // bottom cap
        if (!openBase && radiusBottom > 0) {
            points.push(Vector3.vector(0, 1, 0).scale(-heightHalf));
            for (x = 0; x < radialSegments; x++) {
                const v1: number = vertices[heightSegments][x + 1];
                const v2: number = vertices[heightSegments][x];
                const v3: number = points.length - 1;
                const n1: Vector3 = Vector3.vector(0, -1, 0);
                const n2: Vector3 = Vector3.vector(0, -1, 0);
                const n3: Vector3 = Vector3.vector(0, -1, 0);
                const uv1: Vector2 = uvs[heightSegments][x + 1].clone();
                const uv2: Vector2 = uvs[heightSegments][x].clone();
                const uv3: Vector2 = new Vector2([uv2.x, 1]);
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
        }
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
}
