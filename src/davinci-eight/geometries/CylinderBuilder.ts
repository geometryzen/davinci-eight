import arc3 from '../geometries/arc3';
import VectorE3 from '../math/VectorE3';
import R3 from '../math/R3';
import SliceSimplexPrimitivesBuilder from '../geometries/SliceSimplexPrimitivesBuilder';
import Spinor3 from '../math/Spinor3';
import SpinorE3 from '../math/SpinorE3';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';

/**
 *
 */
function computeVertices(stress: VectorE3, tilt: SpinorE3, offset: VectorE3, angle: number, generator: SpinorE3, heightSegments: number, thetaSegments: number, points: Vector3[], vertices: number[][], uvs: Vector2[][]) {

    const axis = R3.e3
    const begin = R3.e1

    const halfHeight = Vector3.copy(axis).scale(0.5)

    /**
     * A displacement in the direction of axis that we must move for each height step.
     */
    const stepH = Vector3.copy(axis).direction().scale(1 / heightSegments)

    for (let i = 0; i <= heightSegments; i++) {
        /**
         * The displacement to the current level.
         */
        const dispH = Vector3.copy(stepH).scale(i).sub(halfHeight)
        const verticesRow: number[] = [];
        const uvsRow: Vector2[] = [];
        /**
         * Interesting that the v coordinate is 1 at the base and 0 at the top!
         * This is because i originally went from top to bottom.
         */
        const v = (heightSegments - i) / heightSegments
        /**
         * arcPoints.length => thetaSegments + 1
         */
        const arcPoints = arc3(begin, angle, generator, thetaSegments)
        /**
         * j < arcPoints.length => j <= thetaSegments
         */
        for (let j = 0, jLength = arcPoints.length; j < jLength; j++) {
            const point = arcPoints[j].add(dispH)

            point.stress(stress)
            point.rotate(tilt)
            point.add(offset)
            /**
             * u will vary from 0 to 1, because j goes from 0 to thetaSegments
             */
            const u = j / thetaSegments;
            points.push(point);
            verticesRow.push(points.length - 1);
            uvsRow.push(new Vector2([u, v]));
        }
        vertices.push(verticesRow);
        uvs.push(uvsRow);
    }

}

export default class CylinderBuilder extends SliceSimplexPrimitivesBuilder {
    public openTop: boolean;
    public openBottom: boolean;
    constructor() {
        super();
        this.openTop = false;
        this.openBottom = false;
        this.setModified(true);
    }
    public regenerate(): void {
        this.data = []
        const heightSegments = this.flatSegments
        const thetaSegments = this.curvedSegments
        const generator: SpinorE3 = Spinor3.dual(R3.e3, false)

        const heightHalf = 1 / 2;

        var points: Vector3[] = [];
        // The double array allows us to manage the i,j indexing more naturally.
        // The alternative is to use an indexing function.
        let vertices: number[][] = [];
        let uvs: Vector2[][] = [];

        computeVertices(this.stress, this.tilt, this.offset, this.sliceAngle, generator, heightSegments, thetaSegments, points, vertices, uvs)

        // TODO: DRY
        const axis = R3.e3

        var na: Vector3;
        var nb: Vector3;
        // sides
        for (let j = 0; j < thetaSegments; j++) {
            na = Vector3.copy(points[vertices[0][j]]);
            nb = Vector3.copy(points[vertices[0][j + 1]]);
            // FIXME: This isn't geometric.
            na.setY(0).direction();
            nb.setY(0).direction();
            for (let i = 0; i < heightSegments; i++) {
                /**
                 *  2-------3
                 *  |       | 
                 *  |       |
                 *  |       |
                 *  1-------4
                 */
                let v1: number = vertices[i][j];
                let v2: number = vertices[i + 1][j];
                let v3: number = vertices[i + 1][j + 1];
                let v4: number = vertices[i][j + 1];
                // The normals for 1 and 2 are the same.
                // The normals for 3 and 4 are the same.
                let n1 = na.clone();
                let n2 = na.clone();
                let n3 = nb.clone();
                let n4 = nb.clone();
                let uv1 = uvs[i][j].clone();
                let uv2 = uvs[i + 1][j].clone();
                let uv3 = uvs[i + 1][j + 1].clone();
                let uv4 = uvs[i][j + 1].clone()
                this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3])
                this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()])
            }
        }

        // top cap
        if (!this.openTop) {
            // Push an extra point for the center of the top.
            points.push(Vector3.copy(axis).scale(heightHalf).add(this.offset));
            for (let j = 0; j < thetaSegments; j++) {
                let v1: number = vertices[heightSegments][j + 1];
                let v2: number = points.length - 1;
                let v3: number = vertices[heightSegments][j];
                let n1: Vector3 = Vector3.copy(axis)
                let n2: Vector3 = Vector3.copy(axis)
                let n3: Vector3 = Vector3.copy(axis)
                let uv1: Vector2 = uvs[heightSegments][j + 1].clone();
                // Check this
                let uv2: Vector2 = new Vector2([uv1.x, 1]);
                let uv3: Vector2 = uvs[heightSegments][j].clone();
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }

        // bottom cap
        if (!this.openBottom) {
            // Push an extra point for the center of the bottom.
            points.push(Vector3.copy(axis).scale(-heightHalf).add(this.offset))
            for (let j = 0; j < thetaSegments; j++) {
                let v1: number = vertices[0][j]
                let v2: number = points.length - 1
                let v3: number = vertices[0][j + 1]
                let n1: Vector3 = Vector3.copy(axis).scale(-1)
                let n2: Vector3 = Vector3.copy(axis).scale(-1)
                let n3: Vector3 = Vector3.copy(axis).scale(-1)
                let uv1: Vector2 = uvs[0][j].clone()
                // TODO: Check this
                let uv2: Vector2 = new Vector2([uv1.x, 1])
                let uv3: Vector2 = uvs[0][j + 1].clone()
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }
        this.setModified(false)
    }
}
