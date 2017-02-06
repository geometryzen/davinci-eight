import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import Spinor3 from '../math/Spinor3';
import { Vector2 } from '../math/Vector2';
import Vector3 from '../math/Vector3';

export default class RevolutionSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    constructor() {
        super();
    }
    protected revolve(
        points: Vector3[],
        generator: Spinor3,
        segments = 12,
        phiStart = 0,
        phiLength = 2 * Math.PI,
        attitude: Spinor3) {
        /**
         * Temporary list of points.
         */
        var vertices: Vector3[] = [];

        // Determine heuristically whether the user intended to make a complete revolution.
        var isClosed = Math.abs(2 * Math.PI - Math.abs(phiLength - phiStart)) < 0.0001;

        // The number of vertical half planes (phi constant).
        var halfPlanes = isClosed ? segments : segments + 1;
        var inverseSegments = 1.0 / segments;
        var phiStep = (phiLength - phiStart) * inverseSegments;

        var i: number;
        var j: number;
        var il: number;
        var jl: number;

        var R: Spinor3 = Spinor3.one.clone();

        for (i = 0, il = halfPlanes; i < il; i++) {

            var φ = phiStart + i * phiStep;

            R.rotorFromGeneratorAngle(generator, φ);

            for (j = 0, jl = points.length; j < jl; j++) {

                var vertex = points[j].clone();

                // The generator tells us how to rotate the points.
                vertex.rotate(R);

                // The attitude tells us where we want the symmetry axis to be.
                if (attitude) {
                    vertex.rotate(attitude);
                }

                vertices.push(vertex);
            }
        }

        var inversePointLength = 1.0 / (points.length - 1);
        var np = points.length;

        // The denominator for modulo index arithmetic.
        var wrap = np * halfPlanes;

        for (i = 0, il = segments; i < il; i++) {

            for (j = 0, jl = points.length - 1; j < jl; j++) {

                var base = j + np * i;
                var a = base % wrap;
                var b = (base + np) % wrap;
                var c = (base + 1 + np) % wrap;
                var d = (base + 1) % wrap;

                var u0 = i * inverseSegments;
                var v0 = j * inversePointLength;
                var u1 = u0 + inverseSegments;
                var v1 = v0 + inversePointLength;

                this.triangle([vertices[d], vertices[b], vertices[a]], [], [new Vector2([u0, v0]), new Vector2([u1, v0]), new Vector2([u0, v1])]);
                this.triangle([vertices[d], vertices[c], vertices[b]], [], [new Vector2([u1, v0]), new Vector2([u1, v1]), new Vector2([u0, v1])]);
            }
        }
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
}
