import Facet from '../core/Facet';
import Geometric3 from '../math/Geometric3'
import Mesh from '../core/Mesh';
import mustBeObject from '../checks/mustBeObject';
import Shareable from '../core/Shareable';
import TrailConfig from './TrailConfig';

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * Records the position and attitude history of a Mesh allowing the
 * Mesh to be drawn in its historical configuration.
 *
 * @class Trail
 * @extends Shareable
 */
export default class Trail extends Shareable {

  /**
   * The underlying Mesh.
   *
   * @property mesh
   * @type Mesh
   * @private
   */
  private mesh: Mesh

  /**
   * The position history.
   *
   * @property Xs
   * @type {Geometric3[]}
   * @private
   */
  private Xs: Geometric3[] = []

  /**
   * The attitude history.
   *
   * @property Rs
   * @type {Geometric3[]}
   * @private
   */
  private Rs: Geometric3[] = []

  /**
   * The configuration that determines how the history is recorded.
   *
   * @property config
   * @type TrailConfig
   */
  public config: TrailConfig = new TrailConfig();

  /**
   * @property counter
   * @type number
   * @private
   */
  private counter = 0

  /**
   * @class Trail
   * @constructor
   * @param mesh {Mesh}
   */
  constructor(mesh: Mesh) {
    super('Trail')
    mustBeObject('mesh', mesh)
    mesh.addRef()
    this.mesh = mesh
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    this.mesh.release()
    this.mesh = void 0
    super.destructor()
  }

  /**
   * Erases the trail history.
   *
   * @method erase
   * @return {void}
   */
  erase(): void {
    this.Xs = []
    this.Rs = []
  }

  /**
   * Records the Mesh variables according to the interval property.
   *
   * @method snapshot()
   * @return {void}
   */
  snapshot(): void {
    if (this.config.enabled) {
      if (this.counter % this.config.interval === 0) {
        this.Xs.unshift(this.mesh.position.clone())
        this.Rs.unshift(this.mesh.attitude.clone())
      }
      while (this.Xs.length > this.config.retain) {
        this.Xs.pop()
        this.Rs.pop()
      }
      this.counter++
    }
  }

  /**
   * @method draw
   * @param ambients {Facet[]}
   * @return {void}
   */
  draw(ambients: Facet[]): void {
    if (this.config.enabled) {
      // Save the mesh position and attitude so that we can restore them later.
      const X = this.mesh.position.clone()
      const R = this.mesh.attitude.clone()
      const iLength: number = this.Xs.length
      for (let i = 0; i < iLength; i++) {
        this.mesh.position.copyVector(this.Xs[i])
        this.mesh.attitude.copySpinor(this.Rs[i])
        this.mesh.draw(ambients)
      }
      // Restore the mesh position and attitude.
      this.mesh.position.copy(X)
      this.mesh.attitude.copy(R)
    }
  }
}
