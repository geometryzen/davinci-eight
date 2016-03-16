import AbstractColor from '../core/AbstractColor'
import Engine from '../core/Engine'
import SpinorE3 from '../math/SpinorE3'
import VectorE3 from '../math/VectorE3'

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class VisualOptions
 */
interface VisualOptions {

    /**
     * <p>
     * Attitude (spinor)
     * </p>
     *
     * @attribute attitude
     * @type SpinorE3
     * @optional
     * @default 1
     */
    attitude?: SpinorE3;

    /**
     * @attribute color
     * @type AbstractColor
     * @optional
     */
    color?: AbstractColor

    /**
     * @attribute engine
     * @type Engine
     * @optional
     */
    engine?: Engine

    /**
     * @attribute offset
     * @type VectorE3
     * @optional
     * @default 0
     */
    offset?: VectorE3;

    /**
     * <p>
     * Position (vector)
     * </p>
     *
     * @attribute position
     * @type VectorE3
     * @optional
     * @default 0
     */
    position?: VectorE3;

    /**
     * @attribute tilt
     * @type SpinorE3
     * @optional
     * @default 1
     */
    tilt?: SpinorE3;
}

export default VisualOptions
