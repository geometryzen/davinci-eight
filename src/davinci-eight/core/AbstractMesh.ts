import AbstractDrawable from './AbstractDrawable'
import Color from './Color'
import Geometric3 from '../math/Geometric3'
import Matrix4 from '../math/Matrix4'

/**
 * @class AbstractMesh
 * @extends AbstractDrawable
 */
interface AbstractMesh extends AbstractDrawable {

    /**
     * <p>
     * Attitude (spinor)
     * </p>
     *
     * @property R
     * @type Geometric3
     */
    R: Geometric3

    /**
     * <p>
     * Color
     * </p>
     *
     * @property color
     * @type Color
     */
    color: Color

    /**
     * <p>
     * Position (vector)
     * </p>
     *
     * @property X
     * @type Geometric3
     */
    X: Geometric3

    /**
     * <p>
     * Stress (tensor)
     * </p>
     *
     * @property stress
     * @type Matrix4
     */
    stress: Matrix4
}

export default AbstractMesh
