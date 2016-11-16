import ContextManager from '../core/ContextManager';
import CylinderGeometryOptions from './CylinderGeometryOptions';
import notSupported from '../i18n/notSupported';
// import Geometric3 from '../math/Geometric3';
import GeometryElements from '../core/GeometryElements';
import isDefined from '../checks/isDefined';
import mustBeBoolean from '../checks/mustBeBoolean';
import Primitive from '../core/Primitive';
import reduce from '../atoms/reduce';
import arc3 from '../geometries/arc3';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import Spinor3 from '../math/Spinor3';
import SpinorE3 from '../math/SpinorE3';
import { Vector2 } from '../math/Vector2';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

/**
 *
 */
function computeWallVertices(e: VectorE3, cutLine: VectorE3, clockwise: boolean, stress: VectorE3, tilt: SpinorE3, offset: VectorE3, angle: number, generator: SpinorE3, heightSegments: number, thetaSegments: number, points: Vector3[], tangents: Spinor3[], vertices: number[][], uvs: Vector2[][]) {

    const halfHeight = Vector3.copy(e).scale(0.5)

    /**
     * A displacement in the direction of axis that we must move for each height step.
     */
    const stepH = Vector3.copy(e).scale(1 / heightSegments)

    const iLength = heightSegments + 1
    for (let i = 0; i < iLength; i++) {

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
        const arcPoints = arc3(cutLine, angle, generator, thetaSegments)

        /**
         * j < arcPoints.length => j <= thetaSegments
         */
        const jLength = arcPoints.length
        for (let j = 0; j < jLength; j++) {
            // Starting with a point on the wall of the regular cylinder...
            const point = arcPoints[j]
            // Compute the tangent bivector before moving the point up the wall, it need not be normalized.
            const tangent = Spinor3.dual(point, false)
            // Add the displacement up the wall to get the point to the correct height.
            point.add(dispH)

            // Subject the point ot the stress, tilt, offset transformations.
            point.stress(stress)
            point.rotate(tilt)
            point.add(offset)

            // Subject the tangent bivector to the stress and tilt (no need for offset)
            tangent.stress(stress)
            tangent.rotate(tilt)

            /**
             * u will vary from 0 to 1, because j goes from 0 to thetaSegments
             */
            const u = j / thetaSegments

            points.push(point)
            tangents.push(tangent)
            verticesRow.push(points.length - 1);
            uvsRow.push(new Vector2([u, v]));
        }
        vertices.push(verticesRow);
        uvs.push(uvsRow);
    }

}

/**
 *
 */
class CylinderBuilder extends SimplexPrimitivesBuilder {
    /**
     * The symmetry axis of the cylinder.
     */
    private e: VectorE3;

    /**
     *
     */
    private cutLine: VectorE3;

    private sliceAngle = 2 * Math.PI;

    /**
     * The axis and cutLine are treated as the canonical configuration.
     * The tilt moves the cylinder to th referemce configuration.
     */
    private tilt = Spinor3.one();

    /**
     *
     */
    private clockwise: boolean

    /**
     * @property openBase
     * @type boolean
     * @default false
     */
    public openBase = false

    /**
     * @property openCap
     * @type boolean
     * @default false
     */
    public openCap = false

    /**
     * @property openWall
     * @type boolean
     * @default false
     */
    public openWall = false

    /**
     * @class CylinderBuilder
     * @constructor
     * @param e {VectorE3}
     * @param cutLine {VectorE3}
     * @param clockwise {boolean}
     */
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean) {
        super();
        this.e = Vector3.copy(e).normalize()
        this.cutLine = Vector3.copy(cutLine).normalize()
        this.clockwise = clockwise
        this.setModified(true);
    }

    /**
     * @method regenerate
     * @return {void}
     * @protected
     */
    protected regenerate(): void {
        this.data = []
        const heightSegments = this.flatSegments
        const thetaSegments = this.curvedSegments
        const generator: SpinorE3 = Spinor3.dual(this.e, false)

        const heightHalf = 1 / 2;

        const points: Vector3[] = [];
        const tangents: Spinor3[] = [];

        // The double array allows us to manage the i,j indexing more naturally.
        // The alternative is to use an indexing function.
        const vertices: number[][] = [];
        const uvs: Vector2[][] = [];

        computeWallVertices(this.e, this.cutLine, this.clockwise, this.stress, this.tilt, this.offset, this.sliceAngle, generator, heightSegments, thetaSegments, points, tangents, vertices, uvs)

        if (!this.openWall) {
            for (let j = 0; j < thetaSegments; j++) {
                for (let i = 0; i < heightSegments; i++) {
                    /**
                     * We're going to touch every quadrilateral in the wall and split it into two triangles,
                     * 2-1-3 and 4-3-1 (both counter-clockwise when viewed from outside).
                     *
                     *  2-------3
                     *  |       | 
                     *  |       |
                     *  |       |
                     *  1-------4
                     */
                    const v1: number = vertices[i][j]
                    const v2: number = vertices[i + 1][j]
                    const v3: number = vertices[i + 1][j + 1]
                    const v4: number = vertices[i][j + 1]

                    // Compute the normals and normalize them
                    const n1 = Vector3.dual(tangents[v1], true).normalize()
                    const n2 = Vector3.dual(tangents[v2], true).normalize()
                    const n3 = Vector3.dual(tangents[v3], true).normalize()
                    const n4 = Vector3.dual(tangents[v4], true).normalize()

                    const uv1 = uvs[i][j].clone()
                    const uv2 = uvs[i + 1][j].clone()
                    const uv3 = uvs[i + 1][j + 1].clone()
                    const uv4 = uvs[i][j + 1].clone()

                    this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3])
                    this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()])
                }
            }
        }

        if (!this.openCap) {
            // Push an extra point for the center of the cap.
            const top = Vector3.copy(this.e).scale(heightHalf).add(this.offset)
            const tangent = Spinor3.dual(this.e, false).stress(this.stress).rotate(this.tilt)
            const normal = Vector3.dual(tangent, true)
            points.push(top);
            for (let j = 0; j < thetaSegments; j++) {
                const v1: number = vertices[heightSegments][j + 1];
                const v2: number = points.length - 1;
                const v3: number = vertices[heightSegments][j];
                const uv1: Vector2 = uvs[heightSegments][j + 1].clone();
                const uv2: Vector2 = new Vector2([uv1.x, 1]);
                const uv3: Vector2 = uvs[heightSegments][j].clone();
                this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3])
            }
        }

        if (!this.openBase) {
            // Push an extra point for the center of the base.
            const bottom = Vector3.copy(this.e).scale(-heightHalf).add(this.offset)
            const tangent = Spinor3.dual(this.e, false).neg().stress(this.stress).rotate(this.tilt)
            const normal = Vector3.dual(tangent, true)
            points.push(bottom)
            for (let j = 0; j < thetaSegments; j++) {
                const v1: number = vertices[0][j]
                const v2: number = points.length - 1
                const v3: number = vertices[0][j + 1]
                const uv1: Vector2 = uvs[0][j].clone()
                const uv2: Vector2 = new Vector2([uv1.x, 1])
                const uv3: Vector2 = uvs[0][j + 1].clone()
                this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3])
            }
        }
        this.setModified(false)
    }
}

function tilt(v: VectorE3, options: CylinderGeometryOptions = {}): VectorE3 {
    const vector = Vector3.copy(v);
    if (options.tilt) {
        vector.rotate(options.tilt);
    }
    return vector;
}

function cylinderPrimitive(options: CylinderGeometryOptions = {}): Primitive {

    const axis = tilt(Vector3.vector(0, 1, 0), options);
    const cutLine = tilt(Vector3.vector(0, 0, 1), options);

    const builder = new CylinderBuilder(axis, cutLine, false);

    if (isDefined(options.openBase)) {
        builder.openBase = mustBeBoolean('openBase', options.openBase);
    }
    if (isDefined(options.openCap)) {
        builder.openCap = mustBeBoolean('openCap', options.openCap);
    }
    if (isDefined(options.openWall)) {
        builder.openWall = mustBeBoolean('openWall', options.openWall);
    }

    //        builder.stress.copy(stress)
    if (options.offset) {
        builder.offset.copy(options.offset);
    }
    return reduce(builder.toPrimitives());
}

/**
 * A geometry for a Cylinder.
 */
export default class CylinderGeometry extends GeometryElements {

    private _length = 1;
    private _radius = 1;

    constructor(contextManager: ContextManager, options: CylinderGeometryOptions = {}, levelUp = 0) {
        super(contextManager, cylinderPrimitive(options), options, levelUp + 1);
        this.setLoggingName('CylinderGeometry')
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    get radius(): number {
        return this._radius
    }
    set radius(radius: number) {
        this._radius = radius
        this.setPrincipalScale('radius', radius)
    }

    get length(): number {
        return this._length
    }
    set length(length: number) {
        this._length = length
        this.setPrincipalScale('length', length)
    }

    getPrincipalScale(name: string): number {
        switch (name) {
            case 'length': {
                return this._length
            }
            case 'radius': {
                return this._radius
            }
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
            }
        }
    }

    setPrincipalScale(name: string, value: number): void {
        switch (name) {
            case 'length': {
                this._length = value
            }
                break
            case 'radius': {
                this._radius = value
            }
                break
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
            }
        }
        this.setScale(this._radius, this._length, this._radius)
    }
}
