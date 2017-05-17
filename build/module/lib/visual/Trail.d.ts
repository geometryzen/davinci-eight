import { Facet } from '../core/Facet';
import { Geometry } from '../core/Geometry';
import { Material } from '../core/Material';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
import { Mesh } from '../core/Mesh';
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
export declare class Trail extends ShareableBase implements Renderable {
    /**
     * The underlying Mesh.
     */
    private mesh;
    /**
     * The position history.
     */
    private Xs;
    /**
     * The attitude history.
     */
    private Rs;
    /**
     * The parameter history.
     */
    private Ns;
    /**
     * The configuration that determines how the history is recorded.
     */
    config: TrailConfig;
    private counter;
    private modulo;
    /**
     * Constructs a trail for the specified mesh.
     */
    constructor(mesh: Mesh<Geometry, Material>);
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     * @deprecated. Use the render method instead.
     */
    draw(ambients: Facet[]): void;
    /**
     * Erases the trail history.
     */
    erase(): void;
    forEach(callback: (alpha: number, X: Vector3, R: Spinor3) => any): void;
    /**
     * Renders the mesh in its historical positions and attitudes.
     */
    render(ambients: Facet[]): void;
    /**
     * Records the Mesh variables according to the interval property.
     */
    snapshot(alpha?: number): void;
}
