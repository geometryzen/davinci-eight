import { RevolutionSimplexPrimitivesBuilder } from '../geometries/RevolutionSimplexPrimitivesBuilder';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';

/**
 * @hidden
 */
function signum(x: number): number {
    return x >= 0 ? +1 : -1;
}

/**
 * @hidden
 */
function bigger(a: number, b: number): boolean {
    return a >= b;
}

/**
 * @hidden
 */
const permutation = function (direction: VectorE3): number {
    const x = Math.abs(direction.x);
    const y = Math.abs(direction.y);
    const z = Math.abs(direction.z);
    return bigger(x, z) ? (bigger(x, y) ? 0 : 1) : (bigger(y, z) ? 1 : 2);
};

/**
 * @hidden
 */
const orientation = function (cardinalIndex: number, direction: Vector3): number {
    return signum(direction.getComponent(cardinalIndex));
};

/**
 * @hidden
 */
function nearest(direction: Vector3): Vector3 {
    const cardinalIndex = permutation(direction);
    switch (cardinalIndex) {
        case 0: {
            return new Vector3([orientation(cardinalIndex, direction), 0, 0]);
        }
        case 1: {
            return new Vector3([0, orientation(cardinalIndex, direction), 0]);
        }
        case 2: {
            return new Vector3([0, 0, orientation(cardinalIndex, direction)]);
        }
    }
    return Vector3.copy(direction);
}

/**
 * @hidden
 */
export class ArrowSimplexPrimitivesBuilder extends RevolutionSimplexPrimitivesBuilder {
    public lengthCone = 0.20;
    public radiusCone = 0.08;
    public radiusShaft = 0.01;
    public vector: Vector3 = Vector3.vector(1, 0, 0);
    public segments = 12;
    private modified_ = true;
    constructor() {
        super();
    }
    public isModified(): boolean {
        return this.modified_;
    }
    public setModified(modified: boolean): ArrowSimplexPrimitivesBuilder {
        this.modified_ = modified;
        return this;
    }
    protected regenerate(): void {
        const length = this.vector.magnitude();
        const lengthShaft = length - this.lengthCone;
        const halfLength = length / 2;
        const radiusCone = this.radiusCone;
        const radiusShaft = this.radiusShaft;
        const computeArrow = function (direction: Vector3): { points: Vector3[], generator: Spinor3 } {
            const cycle = permutation(direction);
            const sign = orientation(cycle, direction);
            const i = (cycle + 0) % 3;
            const j = (cycle + 2) % 3;
            const k = (cycle + 1) % 3;
            const a = halfLength * sign;
            const b = lengthShaft * sign;
            // data is for an arrow pointing in the e1 direction in the xy-plane.
            const data = [
                [a, 0, 0],    // head end
                [b - a, radiusCone, 0],
                [b - a, radiusShaft, 0],
                [-a, radiusShaft, 0],
                [-a, 0, 0]    // tail end
            ];
            const points = data.map(function (point: number[]) {
                return new Vector3([point[i], point[j], point[k]]);
            });
            const generator = Spinor3.dual(nearest(direction), true);
            return { "points": points, "generator": generator };
        };
        const direction = Vector3.copy(this.vector).normalize();
        const arrow = computeArrow(direction);
        // TODO: The directions may be wrong here and need revesing.
        // The convention is that we rotate from a to b.
        const R = Spinor3.rotorFromDirections(nearest(direction), direction);
        this.data = [];
        super.revolve(arrow.points, arrow.generator, this.segments, 0, 2 * Math.PI, R);
        this.setModified(false);
    }
}
