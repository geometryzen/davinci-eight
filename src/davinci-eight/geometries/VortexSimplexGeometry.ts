import VectorE3 from '../math/VectorE3';
import G3 from '../math/G3';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import mustBeInteger from '../checks/mustBeInteger';
import Spinor3 from '../math/Spinor3';
import {Vector2} from '../math/Vector2';
import Vector3 from '../math/Vector3';

function perpendicular(to: VectorE3): G3 {
    const random = new Vector3([Math.random(), Math.random(), Math.random()])
    random.cross(to).normalize()
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
    public generator: Spinor3 = Spinor3.dual(G3.e3, false);

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

        // const radius = this.radius
        const radiusCone = this.radiusCone
        const radiusShaft = this.radiusShaft
        const radialSegments = this.radialSegments
        const axis: G3 = new G3(0, -this.generator.yz, -this.generator.zx, -this.generator.xy, 0, 0, 0, 0)
        const radial: G3 = perpendicular(axis)
        // FIXME: Change to scale
        const R0: G3 = radial.scale(this.radius)
        // FIXME: More elegant way to construct a G3 from a SpinorE3.
        const generator = new G3(this.generator.a, 0, 0, 0, this.generator.xy, this.generator.yz, this.generator.zx, 0)
        const Rminor0: G3 = axis.ext(radial)

        const n = 9;
        const circleSegments = this.arrowSegments * n;

        const tau = Math.PI * 2;
        const center = new Vector3([0, 0, 0]);

        const normals: Vector3[] = [];
        const points: Vector3[] = [];
        const uvs: Vector2[] = [];

        const alpha = this.lengthShaft / (this.lengthCone + this.lengthShaft);
        const factor = tau / this.arrowSegments;
        const theta = alpha / (n - 2);

        function computeAngle(index: number): number {
            mustBeInteger('index', index)
            const m = index % n;
            if (m === n - 1) {
                return computeAngle(index - 1);
            }
            else {
                const a = (index - m) / n;
                return factor * (a + m * theta);
            }
        }

        function computeRadius(index: number): number {
            mustBeInteger('index', index)
            const m = index % n;
            if (m === n - 1) {
                return radiusCone;
            }
            else {
                return radiusShaft;
            }
        }

        for (let j = 0; j <= radialSegments; j++) {

            // v is the angle inside the vortex tube.
            const v = tau * j / radialSegments;

            for (let i = 0; i <= circleSegments; i++) {

                // u is the angle in the xy-plane measured from the x-axis clockwise about the z-axis.
                const u = computeAngle(i)

                const Rmajor: G3 = generator.scale(-u / 2).exp()

                center.copy(R0).rotate(Rmajor)

                const vertex = Vector3.copy(center)
                const r0: G3 = axis.scale(computeRadius(i))

                const Rminor = Rmajor.mul(Rminor0).mul(Rmajor.__tilde__()).scale(-v / 2).exp()

                // const Rminor = Rminor0.clone().rotate(Rmajor).scale(-v/2).exp()

                const r: G3 = Rminor.mul(r0).mul(Rminor.__tilde__())

                vertex.copy(center).add(r)

                points.push(vertex);

                uvs.push(new Vector2([i / circleSegments, j / radialSegments]));
                normals.push(Vector3.copy(r).normalize());
            }
        }

        for (let j = 1; j <= radialSegments; j++) {

            for (let i = 1; i <= circleSegments; i++) {

                const a = (circleSegments + 1) * j + i - 1;
                const b = (circleSegments + 1) * (j - 1) + i - 1;
                const c = (circleSegments + 1) * (j - 1) + i;
                const d = (circleSegments + 1) * j + i;

                this.triangle([points[a], points[b], points[d]], [normals[a], normals[b], normals[d]], [uvs[a], uvs[b], uvs[d]])
                this.triangle([points[b], points[c], points[d]], [normals[b], normals[c], normals[d]], [uvs[b], uvs[c], uvs[d]])
            }
        }
        this.setModified(false)
    }
}
