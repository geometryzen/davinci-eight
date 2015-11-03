import SimplexGeometry = require('../geometries/SimplexGeometry');
import Simplex = require('../geometries/Simplex');
import SpinG3 = require('../math/SpinG3');
import Symbolic = require('../core/Symbolic');
import R2 = require('../math/R2');
import R3 = require('../math/R3');

/**
 * @class RevolutionSimplexGeometry
 */
class RevolutionSimplexGeometry extends SimplexGeometry {
    /**
     * @class RevolutionSimplexGeometry
     * @constructor
     */
    constructor() {
        super()
    }
    /**
     * @method revolve
     * @param points {R3[]}
     * @param generator {SpinG3}
     * @param segments {number}
     * @param phiStart {number}
     * @param phiLength {number}
     * @param attitude {SpinG3}
     */
    protected revolve(
        points: R3[],
        generator: SpinG3,
        segments: number = 12,
        phiStart: number = 0,
        phiLength: number = 2 * Math.PI,
        attitude: SpinG3) {
        /**
         * Temporary list of points.
         */
        var vertices: R3[] = []

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

        var R: SpinG3 = new SpinG3()

        for (i = 0, il = halfPlanes; i < il; i++) {

            var φ = phiStart + i * phiStep;

            R.rotorFromGeneratorAngle(generator, φ)

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

                this.triangle([vertices[d], vertices[b], vertices[a]], [], [new R2([u0, v0]), new R2([u1, v0]), new R2([u0, v1])])
                this.triangle([vertices[d], vertices[c], vertices[b]], [], [new R2([u1, v0]), new R2([u1, v1]), new R2([u0, v1])])
            }
        }
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
}

export = RevolutionSimplexGeometry;
