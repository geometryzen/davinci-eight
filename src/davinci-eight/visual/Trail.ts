import {Facet} from '../core/Facet';
import {Geometric3} from '../math/Geometric3'
import incLevel from '../base/incLevel';
import {Mesh} from '../core/Mesh';
import mustBeObject from '../checks/mustBeObject';
import {ShareableBase} from '../core/ShareableBase';
import {TrailConfig} from './TrailConfig';

/**
 * <p>
 * Records the position and attitude history of a <code>Mesh</code> allowing the
 * <code>Mesh</code> to be drawn in multiple historical configurations.
 * <p>
 * <p>
 * This class is refererce counted because it maintains a reference to a <code>Mesh</code>.
 * You should call the <code>release</code> method when the trail is no longer required.
 * </p>
 *
 *
 *     // The trail is constructed, at any time, on an existing mesh.
 *     const trail = new EIGHT.Trail(mesh)
 *
 *     // Configure the Trail object, or use the defaults.
 *     trail.config.enabled = true
 *     trail.config.interval = 30
 *     trail.config.retain = 5
 *
 *     // Take a snapshot of the ball position and attitude, usually each animation frame.
 *     trail.snapshot()
 *
 *     // Draw the trail during the animation frame.
 *     trail.draw(ambients)
 *
 *     // Release the trail when no longer required, usually in the window.onunload function.
 *     trail.release()
 */
export class Trail extends ShareableBase {

  /**
   * The underlying Mesh.
   */
  private mesh: Mesh

  /**
   * The position history.
   */
  private Xs: Geometric3[] = []

  /**
   * The attitude history.
   */
  private Rs: Geometric3[] = []

  /**
   * The configuration that determines how the history is recorded.
   */
  public config: TrailConfig = new TrailConfig();

  /**
   *
   */
  private counter = 0

  /**
   * @param mesh
   */
  constructor(mesh: Mesh) {
    super()
    this.setLoggingName('Trail')
    mustBeObject('mesh', mesh)
    mesh.addRef()
    this.mesh = mesh
  }

  /**
   * @param level
   */
  protected destructor(level: number): void {
    this.mesh.release()
    this.mesh = void 0
    super.destructor(incLevel(level))
  }

  /**
   * Erases the trail history.
   */
  erase(): void {
    this.Xs = []
    this.Rs = []
  }

  /**
   * Records the Mesh variables according to the interval property.
   */
  snapshot(): void {
    if (this.config.enabled) {
      if (this.counter % this.config.interval === 0) {
        this.Xs.unshift(this.mesh.X.clone())
        this.Rs.unshift(this.mesh.R.clone())
      }
      while (this.Xs.length > this.config.retain) {
        this.Xs.pop()
        this.Rs.pop()
      }
      this.counter++
    }
  }

  /**
   * @param ambients
   */
  draw(ambients: Facet[]): void {
    if (this.config.enabled) {
      // Save the mesh position and attitude so that we can restore them later.
      const X = this.mesh.X.clone()
      const R = this.mesh.R.clone()
      const iLength: number = this.Xs.length
      for (let i = 0; i < iLength; i++) {
        this.mesh.X.copyVector(this.Xs[i])
        this.mesh.R.copySpinor(this.Rs[i])
        this.mesh.draw(ambients)
      }
      // Restore the mesh position and attitude.
      this.mesh.X.copy(X)
      this.mesh.R.copy(R)
    }
  }
}
