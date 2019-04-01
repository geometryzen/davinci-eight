import { BrowserWindow } from '../base/BrowserWindow';
import { ShareableBase } from '../core/ShareableBase';
import { Vector2 } from '../math/Vector2';
/**
 *
 */
export declare class MouseControls extends ShareableBase {
    /**
     *
     * @default true
     */
    enabled: boolean;
    /**
     *
     * @default false
     */
    noRotate: boolean;
    /**
     *
     * @default false
     */
    noZoom: boolean;
    /**
     *
     * @default false
     */
    noPan: boolean;
    /**
     *
     * @default 0
     */
    minDistance: number;
    /**
     *
     * @default Infinity
     */
    maxDistance: number;
    /**
     *
     */
    private domElement;
    /**
     * The mouse controls operate modally. You can only do one thing (rotate, zoom, or pan) at a time.
     */
    private mode;
    /**
     * Using the keyboard allows us to change modes, so we keep this so that we can revert.
     */
    private prevMode;
    /**
     *
     */
    protected moveCurr: Vector2;
    /**
     *
     */
    protected movePrev: Vector2;
    /**
     *
     */
    protected zoomStart: Vector2;
    /**
     *
     */
    protected zoomEnd: Vector2;
    /**
     *
     */
    protected panStart: Vector2;
    /**
     *
     */
    protected panEnd: Vector2;
    /**
     * Initialized by calling handleResize
     */
    private screenLoc;
    /**
     * Think of this vector as running from the top left corner of the screen.
     */
    private circleExt;
    /**
     * Think of this vector as running from the bottom left corner of the screen.
     */
    private screenExt;
    private mouseOnCircle;
    private mouseOnScreen;
    private mousedown;
    private mousemove;
    private mouseup;
    private mousewheel;
    private keydown;
    private keyup;
    private contextmenu;
    private wnd;
    /**
     *
     * @param wnd
     */
    constructor(wnd?: BrowserWindow);
    protected destructor(levelUp: number): void;
    /**
     * Simulates a movement of the mouse in coordinates -1 to +1 in both directions.
     *
     * @param x
     * @param y
     */
    move(x: number, y: number): void;
    /**
     * @param domElement
     */
    subscribe(domElement: HTMLElement): void;
    /**
     *
     */
    unsubscribe(): void;
    disableContextMenu(): void;
    enableContextMenu(): void;
    /**
     *
     */
    reset(): void;
    /**
     * Computes coordinates in the range [-1,+1] in both e1 and e2 directions.
     * e1 goes to the RIGHT
     * e2 goes UP
     * Updates the mouseOnCircle property.
     *
     * @param mouse
     */
    private updateMouseOnCircle;
    /**
     * Computes coordinates in the range [0,1] in both e1 and e2 directions.
     * e1 goes to the RIGHT
     * e2 goes DOWN
     * Updates the mouseOnScreen property.
     *
     * @param mouse
     */
    private updateMouseOnScreen;
    /**
     * This should be called whenever the window is resized.
     */
    handleResize(): void;
}
