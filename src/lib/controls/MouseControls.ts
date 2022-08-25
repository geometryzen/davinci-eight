import { BrowserHTMLElement } from '../base/BrowserHTMLElement';
import { BrowserWindow } from '../base/BrowserWindow';
import { mustBeObject } from '../checks/mustBeObject';
import { ShareableBase } from '../core/ShareableBase';
import { Vector2 } from '../math/Vector2';
import { MouseCoordinates } from './MouseCoordinates';

/**
 * @hidden
 */
const MODE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

/**
 * The index into the keys array is ROTATE=0, ZOOM=1, PAN=2
 * @hidden
 */
const keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];

/**
 * @hidden
 */
export class MouseControls extends ShareableBase {

    /**
     *
     * @default true
     */
    public enabled = true;

    /**
     *
     * @default false
     */
    public noRotate = false;

    /**
     *
     * @default false
     */
    public noZoom = false;

    /**
     *
     * @default false
     */
    public noPan = false;

    /**
     *
     * @default 0
     */
    public minDistance = 0;

    /**
     *
     * @default Infinity
     */
    public maxDistance = Infinity;

    /**
     *
     */
    private domElement: BrowserHTMLElement;

    /**
     * The mouse controls operate modally. You can only do one thing (rotate, zoom, or pan) at a time.
     */
    private mode = MODE.NONE;

    /**
     * Using the keyboard allows us to change modes, so we keep this so that we can revert.
     */
    private prevMode = MODE.NONE;

    /**
     *
     */
    protected moveCurr = new Vector2();

    /**
     *
     */
    protected movePrev = new Vector2();

    /**
     *
     */
    protected zoomStart = new Vector2();

    /**
     *
     */
    protected zoomEnd = new Vector2();

    /**
     *
     */
    protected panStart = new Vector2();

    /**
     *
     */
    protected panEnd = new Vector2();

    /**
     * Initialized by calling handleResize
     */
    private screenLoc = new Vector2();

    /**
     * Think of this vector as running from the top left corner of the screen.
     */
    private circleExt = new Vector2();

    /**
     * Think of this vector as running from the bottom left corner of the screen.
     */
    private screenExt = new Vector2();

    private mouseOnCircle = new Vector2();
    private mouseOnScreen = new Vector2();
    private mousedown: (event: MouseEvent) => any;
    private mousemove: (event: MouseEvent) => unknown;
    private mouseup: (event: MouseEvent) => any;
    private mousewheel: (event: MouseEvent) => any;
    private keydown: (event: KeyboardEvent) => any;
    private keyup: (event: KeyboardEvent) => any;
    private contextmenu: (event: PointerEvent) => any;
    private wnd: BrowserWindow;

    /**
     *
     * @param wnd
     */
    constructor(wnd: BrowserWindow = window) {
        super();
        this.setLoggingName('MouseControls');
        this.wnd = mustBeObject('wnd', wnd);

        /**
         *
         */
        this.mousedown = (event: MouseEvent) => {
            if (!this.enabled) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (this.mode === MODE.NONE) {
                this.mode = event.button;
            }
            if (this.mode === MODE.ROTATE && !this.noRotate) {
                this.updateMouseOnCircle(event);
                this.moveCurr.copy(this.mouseOnCircle);
                this.movePrev.copy(this.mouseOnCircle);
            }
            else if (this.mode === MODE.ZOOM && !this.noZoom) {
                this.updateMouseOnScreen(event);
                this.zoomStart.copy(this.mouseOnScreen);
                this.zoomEnd.copy(this.mouseOnScreen);
            }
            else if (this.mode === MODE.PAN && !this.noPan) {
                this.updateMouseOnScreen(event);
                this.panStart.copy(this.mouseOnScreen);
                this.panEnd.copy(this.mouseOnScreen);
            }
            this.wnd.document.addEventListener('mousemove', this.mousemove as EventListener, false);
            this.wnd.document.addEventListener('mouseup', this.mouseup as EventListener, false);
        };

        /**
         *
         */
        this.mousemove = (event: MouseEvent) => {
            if (!this.enabled) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (this.mode === MODE.ROTATE && !this.noRotate) {
                this.movePrev.copy(this.moveCurr);
                this.updateMouseOnCircle(event);
                this.moveCurr.copy(this.mouseOnCircle);
            }
            else if (this.mode === MODE.ZOOM && !this.noZoom) {
                this.updateMouseOnScreen(event);
                this.zoomEnd.copy(this.mouseOnScreen);
            }
            else if (this.mode === MODE.PAN && !this.noPan) {
                this.updateMouseOnScreen(event);
                this.panEnd.copy(this.mouseOnScreen);
            }
        };

        /**
         *
         */
        this.mouseup = (event: MouseEvent) => {
            if (!this.enabled) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            this.mode = MODE.NONE;
            this.wnd.document.removeEventListener('mousemove', this.mousemove as EventListener);
            this.wnd.document.removeEventListener('mouseup', this.mouseup as EventListener);
        };

        /**
         *
         */
        this.mousewheel = (event: MouseEvent) => {
            if (!this.enabled) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();

            let delta = 0;
            if ((event as any)['wheelDelta']) { // WebKit / Opera / Explorer 9
                delta = (event as any)['wheelDelta'] / 40;
            }
            else if (event.detail) { // Firefox
                delta = event.detail / 3;
            }
            this.zoomStart.y += delta * 0.01;
        };

        /**
         *
         */
        this.keydown = (event: KeyboardEvent) => {
            if (!this.enabled) {
                return;
            }
            this.wnd.removeEventListener('keydown', this.keydown as EventListener, false);
            this.prevMode = this.mode;
            if (this.mode !== MODE.NONE) {
                // If we are already in a mode then keydown can't change it.
                // The key must go down before the mouse causes us to enter a mode.
                return;
            }
            else if (event.keyCode === keys[MODE.ROTATE] && !this.noRotate) {
                // Pressing 'A'...
                this.mode = MODE.ROTATE;
            }
            else if (event.keyCode === keys[MODE.ZOOM] && !this.noRotate) {
                // Pressing 'S'...
                this.mode = MODE.ZOOM;
            }
            else if (event.keyCode === keys[MODE.PAN] && !this.noRotate) {
                // Pressing 'D'...
                this.mode = MODE.PAN;
            }
        };

        /**
         *
         */
        this.keyup = (event: KeyboardEvent) => {
            if (!this.enabled) {
                return;
            }
            this.mode = this.prevMode;
            this.wnd.addEventListener('keydown', this.keydown as EventListener, false);
        };
    }

    protected destructor(levelUp: number): void {
        if (this.domElement) {
            this.unsubscribe();
        }
        super.destructor(levelUp + 1);
    }

    /**
     * Simulates a movement of the mouse in coordinates -1 to +1 in both directions.
     *
     * @param x
     * @param y
     */
    public move(x: number, y: number): void {
        this.moveCurr.x = x;
        this.moveCurr.y = y;
    }

    /**
     * @param domElement
     */
    public subscribe(domElement: HTMLElement): void {
        if (this.domElement) {
            this.unsubscribe();
        }
        this.domElement = domElement;
        this.disableContextMenu();
        this.domElement.addEventListener('mousedown', this.mousedown as EventListener, false);
        this.domElement.addEventListener('mousewheel', this.mousewheel as EventListener, false);
        this.domElement.addEventListener('DOMMouseScroll', this.mousewheel as EventListener, false); // Firefox
        this.wnd.addEventListener('keydown', this.keydown as EventListener, false);
        this.wnd.addEventListener('keyup', this.keyup as EventListener, false);

        this.handleResize();
    }

    /**
     *
     */
    public unsubscribe(): void {
        if (this.domElement) {
            this.enableContextMenu();
            this.domElement.removeEventListener('mousedown', this.mousedown as EventListener, false);
            this.domElement.removeEventListener('mousewheel', this.mousewheel as EventListener, false);
            this.domElement.removeEventListener('DOMMouseScroll', this.mousewheel as EventListener, false); // Firefox
            this.domElement = void 0;
            this.wnd.removeEventListener('keydown', this.keydown as EventListener, false);
            this.wnd.removeEventListener('keyup', this.keyup as EventListener, false);
        }
    }

    public disableContextMenu(): void {
        if (this.domElement) {
            if (!this.contextmenu) {
                this.contextmenu = (event: PointerEvent) => {
                    event.preventDefault();
                };
                this.domElement.addEventListener('contextmenu', this.contextmenu as EventListener, false);
            }
        }
    }

    public enableContextMenu(): void {
        if (this.domElement) {
            if (this.contextmenu) {
                this.domElement.removeEventListener('contextmenu', this.contextmenu as EventListener, false);
                this.contextmenu = void 0;
            }
        }
    }

    /**
     *
     */
    public reset(): void {
        this.mode = MODE.NONE;
    }

    /**
     * Computes coordinates in the range [-1,+1] in both e1 and e2 directions.
     * e1 goes to the RIGHT
     * e2 goes UP
     * Updates the mouseOnCircle property.
     *
     * @param mouse
     */
    private updateMouseOnCircle(mouse: MouseCoordinates): void {
        this.mouseOnCircle.x = mouse.pageX;
        this.mouseOnCircle.y = -mouse.pageY;
        this.mouseOnCircle.sub(this.screenLoc).scale(2).sub(this.circleExt).divByScalar(this.circleExt.x);
    }

    /**
     * Computes coordinates in the range [0,1] in both e1 and e2 directions.
     * e1 goes to the RIGHT
     * e2 goes DOWN
     * Updates the mouseOnScreen property.
     *
     * @param mouse
     */
    private updateMouseOnScreen(mouse: MouseCoordinates): void {
        this.mouseOnScreen.x = mouse.pageX;
        this.mouseOnScreen.y = -mouse.pageY;
        this.mouseOnScreen.sub(this.screenLoc);
        this.mouseOnScreen.x /= this.circleExt.x;
        this.mouseOnScreen.y /= this.circleExt.y;
    }

    /**
     * This should be called whenever the window is resized.
     */
    public handleResize(): void {
        if (false/*this.domElement === document*/) {
            // this.screen.left = 0;
            // this.screen.top = 0;
            // this.screen.width = window.innerWidth;
            // this.screen.height = window.innerHeight;
        }
        else {
            const boundingRect = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            const domElement = this.domElement.ownerDocument.documentElement;
            this.screenLoc.x = boundingRect.left + window.pageXOffset - domElement.clientLeft;
            this.screenLoc.y = -(boundingRect.top + window.pageYOffset - domElement.clientTop);
            this.circleExt.x = boundingRect.width;
            this.circleExt.y = -boundingRect.height;
            this.screenExt.x = boundingRect.width;
            this.screenExt.y = boundingRect.height;
        }
    }
}
