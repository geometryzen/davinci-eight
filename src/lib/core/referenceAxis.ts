import { Geometric3 } from '../math/Geometric3';
import { R3 } from '../math/R3';
import { vec } from '../math/R3';
import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';

export interface AxisOptions {
    /**
     * 
     */
    axis?: VectorE3;
    /**
     * Deprecated. Use axis instead.
     */
    height?: VectorE3 | number;
    /**
     * 
     */
    meridian?: VectorE3;
    /**
     * Deprecated. Use meridian instead,
     */
    cutLine?: VectorE3;
    /**
     * 
     */
    tilt?: SpinorE3;
}

/**
 * This function computes the reference axis of an object.
 */
export function referenceAxis(options: AxisOptions, fallback: VectorE3): Readonly<R3> {
    if (options.tilt) {
        const axis = Geometric3.fromVector(canonicalAxis).rotate(options.tilt);
        return vec(axis.x, axis.y, axis.z);
    }
    else if (options.axis) {
        const axis = options.axis;
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (typeof options.height === 'object') {
        console.warn("height is deprecated. Please use axis instead.");
        const axis = options.height;
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (options.meridian) {
        const B = Geometric3.dualOfVector(canonicalAxis);
        const tilt = Geometric3.rotorFromVectorToVector(canonicalMeridian, options.meridian, B);
        const axis = Geometric3.fromVector(canonicalAxis).rotate(tilt);
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (options.cutLine) {
        console.warn("cutLine is deprecated. Please use meridian instead.");
        const B = Geometric3.dualOfVector(canonicalAxis);
        const tilt = Geometric3.rotorFromVectorToVector(canonicalMeridian, options.cutLine, B);
        const axis = Geometric3.fromVector(canonicalAxis).rotate(tilt);
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else {
        return vec(fallback.x, fallback.y, fallback.z);
    }
}
