import AmbientLight from '../facets/AmbientLight'
import Color from '../core/Color'
import DirectionalLight from '../facets/DirectionalLight'
import Engine from '../core/Engine'
import exchange from '../base/exchange'
import Facet from '../core/Facet'
import PerspectiveCamera from '../facets/PerspectiveCamera'
import R3 from '../math/R3'
import Scene from '../core/Scene'
import ShareableBase from '../core/ShareableBase'

/**
 * A Portal into the WebGL canvas.
 *
 * @class Viewport
 * @extends ShareableBase
 */
export default class Viewport extends ShareableBase {

  private engine: Engine

  private _scene: Scene

  private ambients: Facet[] = []

  /**
   * @property ambLight
   * @type AmbientLight
   */
  public ambLight = new AmbientLight(Color.gray)

  /**
   * @property dirLight
   * @type DirectionalLight
   */
  public dirLight = new DirectionalLight(R3.e3.neg(), Color.gray)

  /**
   * @property camera
   * @type PerspectiveCamera
   */
  public camera = new PerspectiveCamera()

  /**
   * @property x
   * @type number
   */
  public x = 0

  /**
   * @property y
   * @type number
   */
  public y = 0

  /**
   * @property width
   * @type number
   */
  public width = 0

  /**
   * @property height
   * @type number
   */
  public height = 0

  /**
   * @class Viewport
   * @constructor
   * @param engine {Engine}
   */
  constructor(engine: Engine) {
    super()
    this.setLoggingName('Viewport')

    if (engine) {
      engine.addRef()
      this.engine = engine
    }

    this.ambients.push(this.ambLight)
    this.ambients.push(this.dirLight)
    this.ambients.push(this.camera)
  }

  /**
   * @property scene
   * @type Scene
   */
  get scene(): Scene {
    const scene = this._scene
    if (scene) {
      scene.addRef()
      return scene
    }
  }
  set scene(scene: Scene) {
    this._scene = exchange(this._scene, scene)
  }

  /**
   * @method draw
   * @return {void}
   */
  public draw(): void {
    if (this._scene) {
      if (this.engine) {
        this.engine.viewport(this.x, this.y, this.width, this.height)
      }
      this._scene.draw(this.ambients)
    }
  }

  /**
   * @method setPortal
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   * @return {void}
   */
  public setPortal(x: number, y: number, width: number, height: number): void {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    if (this.camera) {
      this.camera.setAspect(width / height)
    }
  }

  /**
   * @method destructor
   * @param levelUp {number}
   * @return {void}
   * @protected
   */
  protected destructor(levelUp: number): void {
    this.engine = exchange(this.engine, void 0)
    this._scene = exchange(this._scene, void 0)
    super.destructor(levelUp + 1)
  }
}
