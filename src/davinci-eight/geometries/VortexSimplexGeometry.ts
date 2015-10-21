import VectorE3 = require('../math/VectorE3')
import Euclidean3 = require('../math/Euclidean3')
import SimplexGeometry = require('../geometries/SimplexGeometry')
import mustBeInteger = require('../checks/mustBeInteger')
import mustBeString = require('../checks/mustBeString')
import Simplex = require('../geometries/Simplex')
import MutableSpinorE3 = require('../math/MutableSpinorE3')
import Symbolic = require('../core/Symbolic')
import MutableVectorE2 = require('../math/MutableVectorE2')
import MutableVectorE3 = require('../math/MutableVectorE3')

function perpendicular(to: VectorE3): Euclidean3 {
    var random = new MutableVectorE3([Math.random(), Math.random(), Math.random()])
    random.cross(to).normalize()
    return new Euclidean3(0, random.x, random.y, random.z, 0, 0, 0, 0)
}

/**
 * @class VortexSimplexGeometry
 */
class VortexSimplexGeometry extends SimplexGeometry {

    public radius: number = 1;
    public radiusCone: number = 0.08;
    public radiusShaft: number = 0.01;
    public lengthCone: number = 0.2;
    public lengthShaft: number = 0.8;
    public arrowSegments: number = 8;
    public radialSegments: number = 12;
    public generator: MutableSpinorE3 = new MutableSpinorE3([0, 0, 1, 0]);
    /**
     * @class VortexSimplexGeometry
     * @constructor
     * @param type [string = 'VortexSimplexGeometry']
     */
    constructor(type: string = 'VortexSimplexGeometry') {
        super(mustBeString('type', type))
        this.setModified(true)
    }

    public isModified(): boolean {
        return this.generator.modified
    }
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {ArrowSimplexGeometry}
     */
    public setModified(modified: boolean): VortexSimplexGeometry {
        this.generator.modified = modified
        return this
    }
    /**
     * @method regenerate
     * @return {void}
     */
    regenerate(): void {

        this.data = []

        var radius = this.radius
        var radiusCone = this.radiusCone
        var radiusShaft = this.radiusShaft
        var radialSegments = this.radialSegments
        var axis: Euclidean3 = new Euclidean3(0, -this.generator.yz, -this.generator.zx, -this.generator.xy, 0, 0, 0, 0)
        var radial: Euclidean3 = perpendicular(axis)
        // FIXME: Change to scale
        var R0: Euclidean3 = radial.scalarMultiply(this.radius)
        var generator = new Euclidean3(this.generator.w, 0, 0, 0, this.generator.xy, this.generator.yz, this.generator.zx, 0)
        var Rminor0: Euclidean3 = axis.wedge(radial)

        var n = 9;
        var circleSegments = this.arrowSegments * n;

        var tau = Math.PI * 2;
        var center = new MutableVectorE3([0, 0, 0]);

        var normals: MutableVectorE3[] = [];
        var points: MutableVectorE3[] = [];
        var uvs: MutableVectorE2[] = [];

        var alpha = this.lengthShaft / (this.lengthCone + this.lengthShaft);
        var factor = tau / this.arrowSegments;
        var theta = alpha / (n - 2);

        function computeAngle(index: number): number {
            mustBeInteger('index', index)
            var m = index % n;
            if (m === n - 1) {
                return computeAngle(index - 1);
            }
            else {
                var a = (index - m) / n;
                return factor * (a + m * theta);
            }
        }

        function computeRadius(index: number): number {
            mustBeInteger('index', index)
            var m = index % n;
            if (m === n - 1) {
                return radiusCone;
            }
            else {
                return radiusShaft;
            }
        }

        for (var j = 0; j <= radialSegments; j++) {

            // v is the angle inside the vortex tube.
            var v = tau * j / radialSegments;

            for (var i = 0; i <= circleSegments; i++) {

                // u is the angle in the xy-plane measured from the x-axis clockwise about the z-axis.
                var u = computeAngle(i)

                var Rmajor: Euclidean3 = generator.scalarMultiply(-u / 2).exp()

                center.copy(R0).rotate(Rmajor)

                var vertex = MutableVectorE3.copy(center)
                var r0: Euclidean3 = axis.scalarMultiply(computeRadius(i))

                var Rminor = Rmajor.mul(Rminor0).mul(Rmajor.__tilde__()).scalarMultiply(-v / 2).exp()

                // var Rminor = Rminor0.clone().rotate(Rmajor).scale(-v/2).exp()

                var r: Euclidean3 = Rminor.mul(r0).mul(Rminor.__tilde__())

                vertex.sum(center, r)

                points.push(vertex);

                uvs.push(new MutableVectorE2([i / circleSegments, j / radialSegments]));
                normals.push(MutableVectorE3.copy(r).normalize());
            }
        }

        for (var j = 1; j <= radialSegments; j++) {

            for (var i = 1; i <= circleSegments; i++) {

                var a = (circleSegments + 1) * j + i - 1;
                var b = (circleSegments + 1) * (j - 1) + i - 1;
                var c = (circleSegments + 1) * (j - 1) + i;
                var d = (circleSegments + 1) * j + i;

                this.triangle([points[a], points[b], points[d]], [normals[a], normals[b], normals[d]], [uvs[a], uvs[b], uvs[d]])
                this.triangle([points[b], points[c], points[d]], [normals[b], normals[c], normals[d]], [uvs[b], uvs[c], uvs[d]])
            }
        }
        this.setModified(false)
    }
}

export = VortexSimplexGeometry;
