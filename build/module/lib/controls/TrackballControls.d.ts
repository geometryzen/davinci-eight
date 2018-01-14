import { BrowserWindow } from '../base/BrowserWindow';
import { VectorE3 } from '../math/VectorE3';
import { ViewControls } from './ViewControls';
/**
 * <p>
 * Allows a camera to be manipulated using mouse controls.
 * </p>
 *
 *     // The trackball controls a view implementation such as a camera.
 *     const camera = new EIGHT.PerspectiveCamera()
 *
 *     // Create TrackballControls anytime.
 *     const controls = new EIGHT.TrackballControls(camera)
 *
 *     // Subscribe to mouse events, usually in the window.onload function.
 *     controls.subscribe(canvas)
 *
 *     // Update the camera position, usually in the animate function.
 *     controls.update()
 *
 *     // Stop listening to mouse events.
 *     controls.unsubscribe()
 *
 *     // Inform the controls they are no longer needed, usually in the window.onunload function.
 *     controls.release()
 *
 * You may decide to update directional lighting to synchronize with the camera.
 */
export declare class TrackballControls extends ViewControls {
    private moveDirection;
    private eyeMinusLookDirection;
    private objectUpDirection;
    private objectSidewaysDirection;
    /**
     * The bivector for a rotation.
     */
    private B;
    private rotor;
    private mouseChange;
    private pan;
    private objectUp;
    /**
     *
     * @param view eye, look, and up vectors. The coordinates will be manipulated by this object.
     * @param wnd The browser window. Used to add listeners for mouse and keyboard events.
     */
    constructor(view: {
        eye: VectorE3;
        look: VectorE3;
        up: VectorE3;
    }, wnd?: BrowserWindow);
    protected destructor(levelUp: number): void;
    /**
     *
     */
    protected rotateCamera(): void;
    /**
     *
     */
    protected panCamera(): void;
}
