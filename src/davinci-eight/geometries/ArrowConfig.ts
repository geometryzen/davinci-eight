import Geometric3 from '../math/Geometric3'

/**
 * @class ArrowConfig
 * @deprecated Use ArrowBuilder instead.
 */
export default class ArrowConfig {

    /**
     * @property stress
     * @type {Geometric3} (vector)
     * @default vector(1, 1, 1)
     */
    public stress = Geometric3.vector(1, 1, 1)

    /**
     * @property tilt
     * @type {Geometric3} (spinor)
     * @default 1
     */
    public tilt = Geometric3.one()

    /**
     * @property offset
     * @type {Geometric3}
     * @default 0
     */
    public offset = Geometric3.zero()
}
