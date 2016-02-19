import VectorE3 from '../math/VectorE3';
import G3 from '../math/G3';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import mustBeInteger from '../checks/mustBeInteger';
import Spinor3 from '../math/Spinor3';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';

function perpendicular(to: VectorE3): G3 {
    var random = new Vector3([Math.random(), Math.random(), Math.random()])
    random.cross(to).direction()
    return new G3(0, random.x, random.y, random.z, 0, 0, 0, 0)
}

export default class VortexSimplexGeometry extends SimplexPrimitivesBuilder {

    public radius: number = 1;
    public radiusCone: number = 0.08;
    public radiusShaft: number = 0.01;
    public lengthCone: number = 0.2;
    public lengthShaft: number = 0.8;
    public arrowSegments: number = 8;
    public radialSegments: number = 12;
    public generator: Spinor3 = Spinor3.dual(G3.e3);

    constructor() {
        super()
        this.setModified(true)
    }

    public isModified(): boolean {
        return this.generator.modified
    }
    public setModified(modified: boolean): VortexSimplexGeometry {
        this.generator.modified = modified
        return this
    }
    regenerate(): void {

        this.data = []

        // var radius = this.radius
        var radiusCone = this.radiusCone
        var radiusShaft = this.radiusShaft
        var radialSegments = this.radialSegments
        var axis: G3 = new G3(0, -this.generator.yz, -this.generator.zx, -this.generator.xy, 0, 0, 0, 0)
        var radial: G3 = perpendicular(axis)
        // FIXME: Change to scale
        var R0: G3 = radial.scale(this.radius)
        // FIXME: More elegant way to construct a G3 from a SpinorE3.
        var generator = new G3(this.generator.α, 0, 0, 0, this.generator.xy, this.generator.yz, this.generator.zx, 0)
        var Rminor0: G3 = axis.ext(radial)

        var n = 9;
        var circleSegments = this.arrowSegments * n;

        var tau = Math.PI * 2;
        var center = new Vector3([0, 0, 0]);

        var normals: Vector3[] = [];
        var points: Vector3[] = [];
        var uvs: Vector2[] = [];

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

                var Rmajor: G3 = generator.scale(-u / 2).exp()

                center.copy(R0).rotate(Rmajor)

                var vertex = Vector3.copy(center)
                var r0: G3 = axis.scale(computeRadius(i))

                var Rminor = Rmajor.mul(Rminor0).mul(Rmajor.__tilde__()).scale(-v / 2).exp()

                // var Rminor = Rminor0.clone().rotate(Rmajor).scale(-v/2).exp()

                var r: G3 = Rminor.mul(r0).mul(Rminor.__tilde__())

                vertex.add2(center, r)

                points.push(vertex);

                uvs.push(new Vector2([i / circleSegments, j / radialSegments]));
                normals.push(Vector3.copy(r).direction());
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
