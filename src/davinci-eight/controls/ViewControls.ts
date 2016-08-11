import BrowserWindow from '../base/BrowserWindow';
import {MouseControls} from './MouseControls';
import Vector3 from '../math/Vector3';
import View from '../facets/View';
import {ViewController} from './ViewController';

/**
 *
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
     */
    private view: View;

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
    constructor(view: View, wnd: BrowserWindow) {
        super(wnd);
        this.setLoggingName('ViewControls');
        this.setView(view);
    }

    /**
     * @param levelUp
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

            this.view.eye.copyVector(this.look).addVector(this.eyeMinusLook);
            this.view.look.copyVector(this.look);
            this.view.up.copyVector(this.up);
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
            this.view.eye.copyVector(this.eye0);
            this.view.look.copyVector(this.look0);
            this.view.up.copyVector(this.up0);
        }
        super.reset();
    }

    /**
     * @param view
     */
    public setView(view: View): void {
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
