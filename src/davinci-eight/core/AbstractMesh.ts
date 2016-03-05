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
     * @property attitude
     * @type Geometric3
     */
    attitude: Geometric3

    /**
     * @property color
     * @type Color
     */
    color: Color

    /**
     * @property position
     * @type Geometric3
     */
    position: Geometric3

    /**
     * @property stress
     * @type Matrix4
     */
    stress: Matrix4
}

export default AbstractMesh
