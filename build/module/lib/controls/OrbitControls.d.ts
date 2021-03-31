import { BrowserWindow } from '../base/BrowserWindow';
import { VectorE3 } from '../math/VectorE3';
import { ViewControls } from './ViewControls';
/**
 * <p>
 * <code>OrbitControls</code> move a camera over a sphere such that the camera up vector
 * remains aligned with the local north vector.
 * </p>
 * <p>
 * For rotations, the final camera position dictates a new camera local reference frame.
 * A rotor may be calculated that rotates the camera from its old reference frame to the
 * new reference frame. This rotor may also be interpolated for animations.
 * </p>
 * @hidden
 */
export declare class OrbitControls extends ViewControls {
    /**
     * @param view
     * @param wnd
     */
    constructor(view: {
        eye: VectorE3;
        look: VectorE3;
        up: VectorE3;
    }, wnd?: BrowserWindow);
    /**
     * @param levelUp
     */
    protected destructor(levelUp: number): void;
    /**
     *
     */
    protected rotateCamera(): void;
}
