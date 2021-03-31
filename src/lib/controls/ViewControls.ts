import { BrowserWindow } from '../base/BrowserWindow';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
import { MouseControls } from './MouseControls';
import { ViewController } from './ViewController';

/**
 * @hidden
 */
export class ViewControls extends MouseControls implements ViewController {

    /**
     *
     * @default 1
     */
    public rotateSpeed = 1;

    /**
     *
     * @default 1
     */
    public zoomSpeed = 1;

    /**
     *
     * @default 1
     */
    public panSpeed = 1;

    /**
     * The view.eye value when the view was acquired by this view controller.
     */
    private eye0 = Vector3.vector(0, 0, 1);

    /**
     * The view.look value when the view was acquired by this view controller.
     */
    private look0 = Vector3.zero();

    /**
     * The view.up value when the view was acquired by this view controller.
     */
    private up0 = Vector3.vector(0, 1, 0);

    /**
     * The view that is being controlled.
     * We work only with coordinates to minimize requirements for interoperability.
     */
    private view: { eye: { x: number; y: number; z: number }, look: { x: number; y: number; z: number }, up: { x: number; y: number; z: number } };

    /**
     *
     */
    protected eyeMinusLook = new Vector3();

    /**
     *
     */
    protected look = new Vector3();

    /**
     *
     */
    protected up = new Vector3();

    /**
     * @param view
     * @param wnd
     */
    constructor(view: { eye: VectorE3, look: VectorE3, up: VectorE3 }, wnd: BrowserWindow = window) {
        super(wnd);
        this.setLoggingName('ViewControls');
        this.setView(view);
    }

    /**
     * @hidden
     */
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }

    /**
     * @returns
     */
    protected hasView(): boolean {
        return !!this.view;
    }

    /**
     * This should be called inside the animation frame to update the camera location.
     * Notice that the movement of the mouse controls is decoupled from the effect.
     * We also want to avoid temporary object creation in this and called methods by recycling variables.
     */
    public update(): void {
        if (this.view) {
            this.eyeMinusLook.copy(this.view.eye).sub(this.view.look);
            this.look.copy(this.view.look);
            this.up.copy(this.view.up);

            if (!this.noRotate) {
                this.rotateCamera();
            }
            if (!this.noZoom) {
                this.zoomCamera();
            }
            if (!this.noPan) {
                this.panCamera();
            }

            this.view.eye.x = this.look.x + this.eyeMinusLook.x;
            this.view.eye.y = this.look.y + this.eyeMinusLook.y;
            this.view.eye.z = this.look.z + this.eyeMinusLook.z;
            this.view.look.x = this.look.x;
            this.view.look.y = this.look.y;
            this.view.look.z = this.look.z;
            this.view.up.x = this.up.x;
            this.view.up.y = this.up.y;
            this.view.up.z = this.up.z;
        }
    }

    /**
     *
     */
    protected rotateCamera(): void {
        // Do nothing.
    }

    /**
     *
     */
    protected zoomCamera(): void {
        const factor = 1 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed;
        if (factor !== 1 && factor > 0) {
            this.eyeMinusLook.scale(factor);
            this.zoomStart.copy(this.zoomEnd);
        }
    }

    /**
     *
     */
    protected panCamera(): void {
        // Do nothing
    }

    /**
     *
     */
    public reset(): void {
        if (this.view) {
            this.view.eye.x = this.eye0.x;
            this.view.eye.y = this.eye0.y;
            this.view.eye.z = this.eye0.z;
            this.view.look.x = this.look0.x;
            this.view.look.y = this.look0.y;
            this.view.look.z = this.look0.z;
            this.view.up.x = this.up0.x;
            this.view.up.y = this.up0.y;
            this.view.up.z = this.up0.z;
        }
        super.reset();
    }

    /**
     * @param view
     */
    public setView(view: { eye: VectorE3, look: VectorE3, up: VectorE3 }): void {
        if (view) {
            this.view = view;
        }
        else {
            this.view = void 0;
        }
        this.synchronize();
    }

    /**
     *
     */
    public synchronize(): void {
        const view = this.view;
        if (view) {
            this.eye0.copy(view.eye);
            this.look0.copy(view.look);
            this.up0.copy(view.up);
        }
        else {
            this.eye0.setXYZ(0, 0, 1);
            this.look0.zero();
            this.up0.setXYZ(0, 1, 0);
        }
    }
}
