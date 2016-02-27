import IDrawable from './IDrawable'
import Color from './Color'
import Geometric3 from '../math/Geometric3'
import Matrix4 from '../math/Matrix4'
import Spinor3 from '../math/Spinor3'
import Vector3 from '../math/Vector3'

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
    color: Color
    tilt: Spinor3
    matrix: Matrix4
    scale: Vector3
}

export default IMesh
