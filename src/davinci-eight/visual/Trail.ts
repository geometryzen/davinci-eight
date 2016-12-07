import { Facet } from '../core/Facet';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import Modulo from '../math/Modulo';
import Spinor3 from '../math/Spinor3';
import Vector3 from '../math/Vector3';
import { Mesh } from '../core/Mesh';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import { Renderable } from '../core/Renderable';
import { ShareableBase } from '../core/ShareableBase';
import { TrailConfig } from './TrailConfig';

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
export class Trail extends ShareableBase implements Renderable {

    /**
     * The underlying Mesh.
     */
    private mesh: Mesh<Geometry, Material>;

    /**
     * The position history.
     */
    private Xs: Vector3[] = [];

    /**
     * The attitude history.
     */
    private Rs: Spinor3[] = [];

    /**
     * The configuration that determines how the history is recorded.
     */
    public config: TrailConfig = new TrailConfig();

    private counter = 0;

    private modulo = new Modulo();

    /**
     * Constructs a trail for the specified mesh.
     */
    constructor(mesh: Mesh<Geometry, Material>) {
        super();
        this.setLoggingName('Trail');
        mustBeNonNullObject('mesh', mesh);
        mesh.addRef();
        this.mesh = mesh;
    }

    /**
     *
     */
    protected destructor(levelUp: number): void {
        this.mesh.release();
        this.mesh = void 0;
        super.destructor(levelUp + 1);
    }

    /**
     * @deprecated. Use the render method instead.
     */
    draw(ambients: Facet[]): void {
        console.warn("Trail.draw is deprecated. Please use the Trail.render method instead.");
        this.render(ambients);
    }

    /**
     * Erases the trail history.
     */
    erase(): void {
        this.Xs = [];
        this.Rs = [];
    }

    /**
     * Renders the mesh in its historical positions and attitudes.
     */
    render(ambients: Facet[]): void {
        if (this.config.enabled) {
            // Save the mesh position and attitude so that we can restore them later.
            const mesh = this.mesh;
            const X = mesh.X;
            const R = mesh.R;
            // Save the position as efficiently as possible.
            const x = X.x;
            const y = X.y;
            const z = X.z;
            // Save the attitude as efficiently as possible.
            const a = R.a;
            const yz = R.yz;
            const zx = R.zx;
            const xy = R.xy;
            // Work at the Geometry and Material level for efficiency.
            const geometry = mesh.geometry;
            const material = mesh.material;
            material.use();

            const iL = ambients.length;
            for (let i = 0; i < iL; i++) {
                const facet = ambients[i];
                facet.setUniforms(material);
            }

            geometry.bind(material);
            const Xs = this.Xs;
            const Rs = this.Rs;
            const iLength: number = this.modulo.size;
            for (let i = 0; i < iLength; i++) {
                if (Xs[i]) {
                    X.copyVectorNoChecks(Xs[i]);
                }
                if (Rs[i]) {
                    R.copySpinorNoChecks(Rs[i]);
                }
                mesh.setUniforms();
                geometry.draw();
            }
            geometry.unbind(material);
            geometry.release();
            material.release();
            // Restore the mesh position and attitude.
            X.x = x;
            X.y = y;
            X.z = z;
            R.a = a;
            R.yz = yz;
            R.zx = zx;
            R.xy = xy;
        }
    }

    /**
     * Records the Mesh variables according to the interval property.
     */
    snapshot(): void {
        if (this.config.enabled) {
            if (this.modulo.size !== this.config.retain) {
                this.modulo.size = this.config.retain;
                this.modulo.value = 0;
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
            this.counter++;
        }
    }
}
