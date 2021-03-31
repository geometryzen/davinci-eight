import { BrowserWindow } from '../base/BrowserWindow';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
import { MouseControls } from './MouseControls';
import { ViewController } from './ViewController';
/**
 * @hidden
 */
export declare class ViewControls extends MouseControls implements ViewController {
    /**
     *
     * @default 1
     */
    rotateSpeed: number;
    /**
     *
     * @default 1
     */
    zoomSpeed: number;
    /**
     *
     * @default 1
     */
    panSpeed: number;
    /**
     * The view.eye value when the view was acquired by this view controller.
     */
    private eye0;
    /**
     * The view.look value when the view was acquired by this view controller.
     */
    private look0;
    /**
     * The view.up value when the view was acquired by this view controller.
     */
    private up0;
    /**
     * The view that is being controlled.
     * We work only with coordinates to minimize requirements for interoperability.
     */
    private view;
    /**
     *
     */
    protected eyeMinusLook: Vector3;
    /**
     *
     */
    protected look: Vector3;
    /**
     *
     */
    protected up: Vector3;
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
     * @hidden
     */
    protected destructor(levelUp: number): void;
    /**
     * @returns
     */
    protected hasView(): boolean;
    /**
     * This should be called inside the animation frame to update the camera location.
     * Notice that the movement of the mouse controls is decoupled from the effect.
     * We also want to avoid temporary object creation in this and called methods by recycling variables.
     */
    update(): void;
    /**
     *
     */
    protected rotateCamera(): void;
    /**
     *
     */
    protected zoomCamera(): void;
    /**
     *
     */
    protected panCamera(): void;
    /**
     *
     */
    reset(): void;
    /**
     * @param view
     */
    setView(view: {
        eye: VectorE3;
        look: VectorE3;
        up: VectorE3;
    }): void;
    /**
     *
     */
    synchronize(): void;
}
