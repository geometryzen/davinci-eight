import { reduce } from '../atoms/reduce';
import { ContextManager } from '../core/ContextManager';
import { GeometryElements } from '../core/GeometryElements';
import { Primitive } from '../core/Primitive';
import { Vector3 } from '../math/Vector3';
import { CylindricalShellBuilder } from '../shapes/CylindricalShellBuilder';
import { RingBuilder } from '../shapes/RingBuilder';
import { HollowCylinderGeometryOptions } from './HollowCylinderGeometryOptions';

/**
 * @hidden
 */
const e2 = Vector3.vector(0, 1, 0);
/**
 * @hidden
 */
const e3 = Vector3.vector(0, 0, 1);

/**
 * Generates a Primitive from the specified options.
 * @hidden
 */
function hollowCylinderPrimitive(options: HollowCylinderGeometryOptions = { kind: 'HollowCylinderGeometry' }): Primitive {
    const axis = (typeof options.axis === 'object') ? Vector3.copy(options.axis) : e2;
    const meridian = (typeof options.meridian === 'object') ? Vector3.copy(options.meridian).normalize() : e3;
    const outerRadius = (typeof options.outerRadius === 'number') ? options.outerRadius : 1.0;
    const innerRadius = (typeof options.innerRadius === 'number') ? options.innerRadius : 0.5;
    const sliceAngle = (typeof options.sliceAngle === 'number') ? options.sliceAngle : 2 * Math.PI;

    // Multiple builders each provide a Primitive.
    // A Primitive will typically correspond to one index buffer and several attribute buffers.
    // The Primitives are merged into a single Primitive for efficiency.
    const walls = new CylindricalShellBuilder();

    walls.height.copy(axis);
    walls.cutLine.copy(meridian).normalize().scale(outerRadius);
    walls.clockwise = true;
    walls.sliceAngle = sliceAngle;
    walls.offset.copy(axis).scale(-0.5);

    const outerWalls = walls.toPrimitive();

    walls.cutLine.normalize().scale(innerRadius);
    walls.convex = false;

    const innerWalls = walls.toPrimitive();

    const ring = new RingBuilder();

    ring.e.copy(axis).normalize();
    ring.cutLine.copy(meridian);
    ring.clockwise = true;
    ring.innerRadius = innerRadius;
    ring.outerRadius = outerRadius;
    ring.sliceAngle = sliceAngle;
    ring.offset.copy(axis).scale(0.5);

    const cap = ring.toPrimitive();

    ring.e.scale(-1);
    ring.clockwise = false;
    ring.offset.copy(axis).scale(-0.5);

    const base = ring.toPrimitive();

    return reduce([outerWalls, innerWalls, cap, base]);
}

/**
 * 
 */
export class HollowCylinderGeometry extends GeometryElements {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: HollowCylinderGeometryOptions = { kind: 'HollowCylinderGeometry' }, levelUp = 0) {
        super(contextManager, hollowCylinderPrimitive(options), {}, levelUp + 1);
        this.setLoggingName('HollowCylinderGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('HollowCylinderGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
