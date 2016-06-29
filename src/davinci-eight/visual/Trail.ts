import {Facet} from '../core/Facet';
import Modulo from '../math/Modulo';
import Spinor3 from '../math/Spinor3';
import Vector3 from '../math/Vector3';
import {Mesh} from '../core/Mesh';
import mustBeObject from '../checks/mustBeObject';
import {ShareableBase} from '../core/ShareableBase';
import {TrailConfig} from './TrailConfig';

//
// Scratch variables used to save and restore mesh properties during the draw method.
// This technique avoids allocating temporary objects which give the garbage collector extra work.
//

/**
 * The saved mesh position.
 */
const savedX: Vector3 = Vector3.zero();

/**
 * The saved mesh attitute.
 */
const savedR: Spinor3 = Spinor3.zero();

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
    private Xs: Vector3[] = []

    /**
     * The attitude history.
     */
    private Rs: Spinor3[] = []

    /**
     * The configuration that determines how the history is recorded.
     */
    public config: TrailConfig = new TrailConfig();

    /**
     *
     */
    private counter = 0;

    private modulo = new Modulo();

    /**
     * @param mesh
     */
    constructor(mesh: Mesh) {
        super();
        this.setLoggingName('Trail');
        mustBeObject('mesh', mesh);
        mesh.addRef();
        this.mesh = mesh;
    }

    /**
     * @param levelUp
     */
    protected destructor(levelUp: number): void {
        this.mesh.release();
        this.mesh = void 0;
        super.destructor(levelUp + 1);
    }

    /**
     * Erases the trail history.
     */
    erase(): void {
        this.Xs = [];
        this.Rs = [];
    }

    /**
     * Records the Mesh variables according to the interval property.
     */
    snapshot(): void {
        if (this.config.enabled) {
            if (this.modulo.size !== this.config.retain) {
                this.modulo.size = this.config.retain;
                this.modulo.value = 0
            }

            if (this.counter % this.config.interval === 0) {
                const index = this.modulo.value;
                if (this.Xs[index]) {
                    // When populating an occupied slot, don't create new objects.
                    this.Xs[index].copy(this.mesh.X);
                    this.Rs[index].copy(this.mesh.R);
                }
                else {
                    // When populating an empty slot, allocate a new object and make a copy.
                    this.Xs[index] = Vector3.copy(this.mesh.X);
                    this.Rs[index] = Spinor3.copy(this.mesh.R);
                }
                this.modulo.inc();
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
            const mesh = this.mesh;
            const X = mesh.X;
            const R = mesh.R;
            savedX.copy(X);
            savedR.copy(R);
            const Xs = this.Xs;
            const Rs = this.Rs;
            const iLength: number = Xs.length;
            for (let i = 0; i < iLength; i++) {
                X.copyVector(Xs[i]);
                R.copySpinor(Rs[i]);
                mesh.draw(ambients);
            }
            // Restore the mesh position and attitude.
            X.copyVector(savedX);
            R.copySpinor(savedR);
        }
    }
}
