import ArrowOptions from './ArrowOptions'
import ArrowGeometry from '../geometries/ArrowGeometry'
import ArrowGeometryOptions from '../geometries/ArrowGeometryOptions'
import {Geometric3} from '../math/Geometric3'
import MeshMaterial from '../materials/MeshMaterial'
import MeshMaterialOptions from '../materials/MeshMaterialOptions'
import {Mesh} from '../core/Mesh'
import mustBeDefined from '../checks/mustBeDefined'
import quadVectorE3 from '../math/quadVectorE3'
import R3 from '../math/R3'

function direction(options: ArrowOptions, fallback: R3): R3 {
  if (options.vector) {
    return R3.direction(options.vector)
  }
  else {
    return fallback
  }
}

/**
 * <p>
 * A <code>Mesh</code> in the form of an arrow that may be used to represent a vector quantity.
 * </p>
 *
 *
 *     // Construct the arrow at any time and add it to the scene.
 *     const arrow = new EIGHT.Arrow({color: white})
 *     scene.add(arrow)
 *
 *     // Update the arrow configuration, usually inside the animation function.
 *     arrow.position = position // position is a Geometric3
 *     arrow.attitude = attitude // attitude is a Geometric3
 *     arrow.vector = vector // vector is a Geometric3
 *
 *     // Release the arrow when no longer required.
 *     arrow.release()
 */
export class Arrow extends Mesh {

  /**
   * We know what the initial direction the arrow geometry takes.
   * Since our state variable is the attitude, we must remember the
   * initial direction in order to be able to update the attitude
   * based upon a vector property.
   */
  private direction0: R3;

  /**
   * The vector that this arrow represents.
   * We'll hook up a listener to this property so that mutation of the vector
   * becomes mutation of the attitude and length.
   */
  private _vector: Geometric3;

  private vectorChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;
  private attitudeChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;

  /**
   *
   * @param options
   */
  constructor(options: ArrowOptions = {}) {
    super(void 0, void 0, options.engine)
    this.setLoggingName('Arrow')

    // TODO: This shold be going into the geometry options.
    this.direction0 = direction(options, R3.e2)
    this._vector = Geometric3.fromVector(this.direction0)

    const geoOptions: ArrowGeometryOptions = {}
    geoOptions.engine = options.engine
    const geometry = new ArrowGeometry(geoOptions)

    const matOptions: MeshMaterialOptions = void 0
    const material = new MeshMaterial(matOptions, options.engine)

    this.geometry = geometry
    this.material = material

    geometry.release()
    material.release()

    if (options.color) {
      this.color.copy(options.color)
    }
    if (options.position) {
      this.X.copyVector(options.position)
    }

    /**
     * cascade flag prevents infinite recursion.
     */
    let cascade = true
    this.vectorChangeHandler = (eventName: string, key: string, value: number, vector: Geometric3) => {
      if (cascade) {
        cascade = false
        this.R.rotorFromDirections(this.direction0, vector)
        this.setPrincipalScale('length', Math.sqrt(quadVectorE3(vector)))
        // this.length = Math.sqrt(quadVectorE3(vector))
        cascade = true
      }
    }
    this.attitudeChangeHandler = (eventName: string, key: string, value: number, attitude: Geometric3) => {
      if (cascade) {
        cascade = false
        this._vector.copyVector(this.direction0).rotate(this.R).scale(this.length)
        cascade = true;
      }
    }

    this._vector.on('change', this.vectorChangeHandler)
    this.R.on('change', this.attitudeChangeHandler)
  }

  /**
   * @param levelUp
   */
  protected destructor(levelUp: number): void {
    this._vector.off('change', this.vectorChangeHandler)
    this.R.off('change', this.attitudeChangeHandler)
    super.destructor(levelUp + 1)
  }

  /**
   *
   * @default 1
   */
  private get length(): number {
    return this.getPrincipalScale('length')
  }
  private set length(length: number) {
    this.setPrincipalScale('length', length)
    const magnitude = Math.sqrt(quadVectorE3(this._vector))
    this._vector.scale(length / magnitude)
  }

  /**
   * <p>
   * The vector from the tail of the Arrow to the head of the Arrow.
   * </p>
   */
  get h() {
    return this._vector
  }
  set h(h: Geometric3) {
    mustBeDefined('h', h)
    this._vector.copyVector(h)
  }
}
