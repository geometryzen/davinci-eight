import CylindricalShellBuilder from '../shapes/CylindricalShellBuilder';
import GeometryElements from '../core/GeometryElements';
import HollowCylinderOptions from './HollowCylinderOptions';
import Primitive from '../core/Primitive';
import RingBuilder from '../shapes/RingBuilder';
import reduce from '../atoms/reduce';
import Vector3 from '../math/Vector3';
import VertexArrays from '../core/VertexArrays';
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive';

const e2 = Vector3.vector(0, 1, 0);
const e3 = Vector3.vector(0, 0, 1);

/**
 * Generates a Primitive from the specified options.
 */
function hollowCylinderPrimitive(options: HollowCylinderOptions = {}): Primitive {
    const height = (typeof options.height === 'object') ? Vector3.copy(options.height) : e2;
    const cutLine = (typeof options.cutLine === 'object') ? Vector3.copy(options.cutLine).normalize() : e3;
    const outerRadius = (typeof options.outerRadius === 'number') ? options.outerRadius : 1.0;
    const innerRadius = (typeof options.innerRadius === 'number') ? options.innerRadius : 0.5;
    const sliceAngle = (typeof options.sliceAngle === 'number') ? options.sliceAngle : 2 * Math.PI;

    // Multiple builders each provide a Primitive.
    // A Primitive will typically correspond to one index buffer and several attribute buffers.
    // The Primitives are merged into a single Primitive for efficiency.
    const walls = new CylindricalShellBuilder();

    walls.height.copy(height);
    walls.cutLine.copy(cutLine).normalize().scale(outerRadius);
    walls.clockwise = true;
    walls.sliceAngle = sliceAngle;
    walls.offset.copy(height).scale(-0.5);

    const outerWalls = walls.toPrimitive();

    walls.cutLine.normalize().scale(innerRadius);
    walls.convex = false;

    const innerWalls = walls.toPrimitive();

    const ring = new RingBuilder();

    ring.e.copy(height).normalize();
    ring.cutLine.copy(cutLine);
    ring.clockwise = true;
    ring.innerRadius = innerRadius;
    ring.outerRadius = outerRadius;
    ring.sliceAngle = sliceAngle;
    ring.offset.copy(height).scale(0.5);

    const cap = ring.toPrimitive();

    ring.e.scale(-1);
    ring.clockwise = false;
    ring.offset.copy(height).scale(-0.5);

    const base = ring.toPrimitive();

    return reduce([outerWalls, innerWalls, cap, base]);
}

/**
 * Generates VertexArrays from the specified options.
 * VertexArrays provide an interleaved form of a Primitive so that only one attribute buffer is required.
 */
function hollowCylinderVertexArrays(options: HollowCylinderOptions = {}): VertexArrays {
    return vertexArraysFromPrimitive(hollowCylinderPrimitive(options));
}

export default class HollowCylinderGeometry extends GeometryElements {
    constructor(options: HollowCylinderOptions = {}, levelUp = 0) {
        super(hollowCylinderVertexArrays(options), void 0, options.engine, levelUp + 1);
        if (levelUp === 0) {
            this.synchUp()
        }
    }
}
