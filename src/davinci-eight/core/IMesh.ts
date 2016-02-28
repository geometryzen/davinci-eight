import IDrawable from './IDrawable'
import Color from './Color'
import Geometric3 from '../math/Geometric3'
import Matrix4 from '../math/Matrix4'

/**
 * @class IMesh
 * @extends IDrawable
 */
interface IMesh extends IDrawable {

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

export default IMesh
