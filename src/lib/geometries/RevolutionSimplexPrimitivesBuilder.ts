import { SimplexPrimitivesBuilder } from "../geometries/SimplexPrimitivesBuilder";
import { Spinor3 } from "../math/Spinor3";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";

/**
 * @hidden
 */
export class RevolutionSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    constructor() {
        super();
    }
    protected revolve(points: Vector3[], generator: Spinor3, segments = 12, phiStart = 0, phiLength = 2 * Math.PI, attitude: Spinor3) {
        /**
         * Temporary list of points.
         */
        const vertices: Vector3[] = [];

        // Determine heuristically whether the user intended to make a complete revolution.
        const isClosed = Math.abs(2 * Math.PI - Math.abs(phiLength - phiStart)) < 0.0001;

        // The number of vertical half planes (phi constant).
        const halfPlanes = isClosed ? segments : segments + 1;
        const inverseSegments = 1.0 / segments;
        const phiStep = (phiLength - phiStart) * inverseSegments;

        let i: number;
        let j: number;
        let il: number;
        let jl: number;

        const R: Spinor3 = Spinor3.one.clone();

        for (i = 0, il = halfPlanes; i < il; i++) {
            const φ = phiStart + i * phiStep;

            R.rotorFromGeneratorAngle(generator, φ);

            for (j = 0, jl = points.length; j < jl; j++) {
                const vertex = points[j].clone();

                // The generator tells us how to rotate the points.
                vertex.rotate(R);

                // The attitude tells us where we want the symmetry axis to be.
                if (attitude) {
                    vertex.rotate(attitude);
                }

                vertices.push(vertex);
            }
        }

        const inversePointLength = 1.0 / (points.length - 1);
        const np = points.length;

        // The denominator for modulo index arithmetic.
        const wrap = np * halfPlanes;

        for (i = 0, il = segments; i < il; i++) {
            for (j = 0, jl = points.length - 1; j < jl; j++) {
                const base = j + np * i;
                const a = base % wrap;
                const b = (base + np) % wrap;
                const c = (base + 1 + np) % wrap;
                const d = (base + 1) % wrap;

                const u0 = i * inverseSegments;
                const v0 = j * inversePointLength;
                const u1 = u0 + inverseSegments;
                const v1 = v0 + inversePointLength;

                this.triangle([vertices[d], vertices[b], vertices[a]], [], [new Vector2([u0, v0]), new Vector2([u1, v0]), new Vector2([u0, v1])]);
                this.triangle([vertices[d], vertices[c], vertices[b]], [], [new Vector2([u1, v0]), new Vector2([u1, v1]), new Vector2([u0, v1])]);
            }
        }
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
}
