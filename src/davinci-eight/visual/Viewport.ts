import AmbientLight from '../facets/AmbientLight'
import Color from '../core/Color'
import DirectionalLight from '../facets/DirectionalLight'
import Engine from '../core/Engine'
import exchange from '../base/exchange'
import Facet from '../core/Facet'
import mustBeInteger from '../checks/mustBeInteger'
import PerspectiveCamera from '../facets/PerspectiveCamera'
import R3 from '../math/R3'
import Scene from '../core/Scene'
import ShareableBase from '../core/ShareableBase'

/**
 * <p>
 * A Portal into the WebGL canvas.
 * </p>
 * <p>
 * A viewport specifies the affine transformation of x and y from the
 * normalized device coordinates to window coordinates.
 * </p>
 *
 * @class Viewport
 * @extends ShareableBase
 */
export default class Viewport extends ShareableBase {

  /**
   * @property engine
   * @type Engine
   * @private
   */
  private engine: Engine

  /**
   * @property _scene
   * @type Scene
   * @private
   */
  private _scene: Scene

  /**
   * <p>
   * The facets that are used when drawing the <code>scene</code>.
   * </p>
   *
   * @property ambients
   * @type Facet[]
   */
  public ambients: Facet[] = []

  /**
   * <p>
   * </p>
   *
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
   * <p>
   * The horizontal coordinate for the lower left corner of the viewport origin.
   * </p>
   *
   * @property x
   * @type number
   * @default 0
   */
  public x = 0

  /**
   * <p>
   * The vertical coordinate for the lower left corner of the viewport origin.
   * </p>
   *
   * @property y
   * @type number
   * @default 0
   */
  public y = 0

  /**
   * <p>
   * A positive number specifying the width of the viewport.
   * </p>
   *
   * @property width
   * @type number
   */
  public width = 0

  /**
   * <p>
   * A positive number specifying the height of the viewport.
   * </p>
   *
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

    if (engine instanceof Engine) {
      engine.addRef()
      this.engine = engine
    }
    else {
      throw new Error("engine must be an Engine")
    }

    this.ambients.push(this.ambLight)
    this.ambients.push(this.dirLight)
    this.ambients.push(this.camera)
  }

  /**
   * <p>
   * The <code>Scene</code> associated with this <code>Viewport</code>.
   * </p>
   * <p>
   * The <code>scene</code> may be changed at any time.
   * </p>
   * <p>
   * This property is reference counted.
   * </p>
   *
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
    mustBeInteger('x', x)
    mustBeInteger('y', y)
    mustBeInteger('width', width)
    mustBeInteger('width', width)
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
