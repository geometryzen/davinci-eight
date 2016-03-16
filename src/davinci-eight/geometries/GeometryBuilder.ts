import Engine from '../core/Engine'
import Geometry from '../core/Geometry'
import Primitive from '../core/Primitive'
import Geometric3 from '../math/Geometric3'
import Vector3 from '../math/Vector3'
import VertexArrays from '../core/VertexArrays'

/**
 * @class GeometryBuilder
 */
interface GeometryBuilder {

  /**
   * @property stress
   * @type Vector3
   */
  stress: Vector3

  /**
   * A spinor. The rotor that moves the geometry from its canonical configuration to its
   * initial configuration in which the attitude is 1 (unity).
   *
   * @property tilt
   * @type Geometric3
   */
  tilt: Geometric3

  /**
   * @property offset
   * @type Vector3
   */
  offset: Vector3

  /**
   * @method toGeometry
   * @param engine {Engine}
   * @return {Geometry}
   */
  toGeometry(engine: Engine): Geometry

  /**
   * @method toPrimitives
   * @return {Primitive[]}
   */
  toPrimitives(): Primitive[]

  /**
   * @method toVertexArrays
   * @return {VertexArrays[]}
   */
  toVertexArrays(): VertexArrays[]
}

export default GeometryBuilder
