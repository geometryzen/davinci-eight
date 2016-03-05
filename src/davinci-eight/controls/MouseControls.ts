import Geometric2 from '../math/Geometric2'
import MouseCoordinates from './MouseCoordinates'
import ShareableBase from '../core/ShareableBase'

const MODE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 }

/**
 * The index into the keys array is ROTATE=0, ZOOM=1, PAN=2
 */
const keys = [65 /*A*/, 83 /*S*/, 68 /*D*/]

/**
 * @module EIGHT
 * @submodule controls
 */

/**
 * @class MouseControls
 * @extends ShareableBase
 */
export default class MouseControls extends ShareableBase {

  /**
   * @property enabled
   * @type boolean
   */
  public enabled = true

  /**
   * @property noRotate
   * @type boolean
   * @default false
   */
  public noRotate = false

  /**
   * @property noZoom
   * @type boolean
   * @default false
   */
  public noZoom = false

  /**
   * @property noRotate
   * @type boolean
   * @default false
   */
  public noPan = false

  /**
   * @property minDistance
   * @type number
   * @default 0
   */
  public minDistance = 0

  /**
   * @property maxDistance
   * @type number
   * @default Infinity
   */
  public maxDistance = Infinity

  /**
   * @property domElement
   * @type HTMLElement
   * @private
   */
  private domElement: HTMLElement

  /**
   * The mouse controls operate modally. You can only do one thing (rotate, zoom, or pan) at a time.
   */
  private mode = MODE.NONE

  /**
   * Using the keyboard allows us to change modes, so we keep this so that we can revert.
   */
  private prevMode = MODE.NONE

  protected moveCurr = new Geometric2()
  protected movePrev = new Geometric2()
  protected zoomStart = new Geometric2()
  protected zoomEnd = new Geometric2()
  protected panStart = new Geometric2()
  protected panEnd = new Geometric2()

  /**
   * Initialized by calling handleResize
   *
   * @property screenLoc
   * @type Geometric2
   * @private
   */
  private screenLoc = new Geometric2()
  /**
   * Think of this vector as running from the top left corner of the screen.
   */
  private circleExt = new Geometric2()
  /**
   * Think of this vector as running from the bottom left corner of the screen.
   */
  private screenExt = new Geometric2()

  private mouseOnCircle = new Geometric2()
  private mouseOnScreen = new Geometric2()

  private mousedown: (event: MouseEvent) => any
  private mousemove: (event: MouseEvent) => any
  private mouseup: (event: MouseEvent) => any
  private mousewheel: (event: MouseWheelEvent) => any
  private keydown: (event: KeyboardEvent) => any
  private keyup: (event: KeyboardEvent) => any
  private contextmenu: (event: PointerEvent) => any

  /**
   * @class MouseControls
   * @constructor
   * @param type {string}
   */
  constructor(type: string) {
    super(type)

    /**
     *
     */
    this.mousedown = (event: MouseEvent) => {
      if (!this.enabled) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      if (this.mode === MODE.NONE) {
        this.mode = event.button
      }
      if (this.mode === MODE.ROTATE && !this.noRotate) {
        this.updateMouseOnCircle(event)
        this.moveCurr.copy(this.mouseOnCircle)
        this.movePrev.copy(this.mouseOnCircle)
      }
      else if (this.mode === MODE.ZOOM && !this.noZoom) {
        this.updateMouseOnScreen(event)
        this.zoomStart.copy(this.mouseOnScreen)
        this.zoomEnd.copy(this.mouseOnScreen)
      }
      else if (this.mode === MODE.PAN && !this.noPan) {
        this.updateMouseOnScreen(event)
        this.panStart.copy(this.mouseOnScreen)
        this.panEnd.copy(this.mouseOnScreen)
      }
      document.addEventListener('mousemove', this.mousemove, false)
      document.addEventListener('mouseup', this.mouseup, false)
    }

    /**
     *
     */
    this.mousemove = (event: MouseEvent) => {
      if (!this.enabled) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      if (this.mode === MODE.ROTATE && !this.noRotate) {
        this.movePrev.copy(this.moveCurr);
        this.updateMouseOnCircle(event)
        this.moveCurr.copy(this.mouseOnCircle)
      }
      else if (this.mode === MODE.ZOOM && !this.noZoom) {
        this.updateMouseOnScreen(event)
        this.zoomEnd.copy(this.mouseOnScreen)
      }
      else if (this.mode === MODE.PAN && !this.noPan) {
        this.updateMouseOnScreen(event)
        this.panEnd.copy(this.mouseOnScreen)
      }
    }

    /**
     *
     */
    this.mouseup = (event: MouseEvent) => {
      if (!this.enabled) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      this.mode = MODE.NONE
      document.removeEventListener('mousemove', this.mousemove)
      document.removeEventListener('mouseup', this.mouseup)
    }

    /**
     *
     */
    this.mousewheel = (event: MouseWheelEvent) => {
      if (!this.enabled) {
        return
      }
      event.preventDefault()
      event.stopPropagation()

      let delta = 0
      if (event.wheelDelta) { // WebKit / Opera / Explorer 9
        delta = event.wheelDelta / 40
      }
      else if (event.detail) { // Firefox
        delta = event.detail / 3
      }
      this.zoomStart.y += delta * 0.01
    }

    /**
     *
     */
    this.keydown = (event: KeyboardEvent) => {
      if (!this.enabled) {
        return
      }
      window.removeEventListener('keydown', this.keydown, false)
      this.prevMode = this.mode
      if (this.mode !== MODE.NONE) {
        // If we are already in a mode then keydown can't change it.
        // The key must go down before the mouse causes us to enter a mode.
        return
      }
      else if (event.keyCode === keys[MODE.ROTATE] && !this.noRotate) {
        // Pressing 'A'...
        this.mode = MODE.ROTATE
      }
      else if (event.keyCode === keys[MODE.ZOOM] && !this.noRotate) {
        // Pressing 'S'...
        this.mode = MODE.ZOOM
      }
      else if (event.keyCode === keys[MODE.PAN] && !this.noRotate) {
        // Pressing 'D'...
        this.mode = MODE.PAN
      }
    }

    /**
     *
     */
    this.keyup = (event: KeyboardEvent) => {
      if (!this.enabled) {
        return
      }
      this.mode = this.prevMode
      window.addEventListener('keydown', this.keydown, false)
    }

    /**
     *
     */
    this.contextmenu = (event: PointerEvent) => {
      event.preventDefault()
    }
  }

  /**
   * @method subscribe
   * @param domElement {HTMLElement}
   * @return {void}
   */
  public subscribe(domElement: HTMLElement): void {
    if (this.domElement) {
      this.unsubscribe()
    }
    this.domElement = domElement
    this.domElement.addEventListener('contextmenu', this.contextmenu, false)
    this.domElement.addEventListener('mousedown', this.mousedown, false)
    this.domElement.addEventListener('mousewheel', this.mousewheel, false)
    this.domElement.addEventListener('DOMMouseScroll', this.mousewheel, false) // Firefox
    window.addEventListener('keydown', this.keydown, false)
    window.addEventListener('keyup', this.keydown, false)

    this.handleResize()
  }

  /**
   * @method unsubscribe
   * @return {void}
   */
  public unsubscribe(): void {
    if (this.domElement) {
      this.domElement.removeEventListener('contextmenu', this.contextmenu, false)
      this.domElement.removeEventListener('mousedown', this.mousedown, false)
      this.domElement.removeEventListener('mousewheel', this.mousewheel, false)
      this.domElement.removeEventListener('DOMMouseScroll', this.mousewheel, false) // Firefox
      this.domElement = void 0
      window.removeEventListener('keydown', this.keydown, false)
      window.removeEventListener('keyup', this.keydown, false)
    }
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    if (this.domElement) {
      this.unsubscribe()
    }
    super.destructor()
  }

  /**
   * @method reset
   * @return {void}
   */
  public reset(): void {
    this.mode = MODE.NONE
  }

  /**
   * Computes coordinates in the range [-1,+1] in both e1 and e2 directions.
   * e1 goes to the RIGHT
   * e2 goes UP
   * Updates the mouseOnCircle property.
   *
   * @method updateMouseOnCircle
   * @param mouse {MouseCoordinates}
   * @return {void}
   * @private
   */
  private updateMouseOnCircle(mouse: MouseCoordinates): void {
    this.mouseOnCircle.x = mouse.pageX
    this.mouseOnCircle.y = -mouse.pageY
    this.mouseOnCircle.sub(this.screenLoc).scale(2).sub(this.circleExt).divByScalar(this.circleExt.x)
  }

  /**
   * Computes coordinates in the range [0,1] in both e1 and e2 directions.
   * e1 goes to the RIGHT
   * e2 goes DOWN
   * Updates the mouseOnScreen property.
   *
   * @method updateMouseOnScreen
   * @param mouse {MouseCoordinates}
   * @return {void}
   * @private
   */
  private updateMouseOnScreen(mouse: MouseCoordinates): void {
    this.mouseOnScreen.x = mouse.pageX
    this.mouseOnScreen.y = -mouse.pageY
    this.mouseOnScreen.sub(this.screenLoc)
    this.mouseOnScreen.x /= this.circleExt.x
    this.mouseOnScreen.y /= this.circleExt.y
  }

  /**
   * This should be called whenever the window is resized
   *
   * @method handleResize
   * @return {void}
   */
  public handleResize(): void {
    if (false/*this.domElement === document*/) {
      // this.screen.left = 0;
      // this.screen.top = 0;
      // this.screen.width = window.innerWidth;
      // this.screen.height = window.innerHeight;
    }
    else {
      const boundingRect = this.domElement.getBoundingClientRect()
      // adjustments come from similar code in the jquery offset() function
      const domElement = this.domElement.ownerDocument.documentElement
      this.screenLoc.x = boundingRect.left + window.pageXOffset - domElement.clientLeft
      this.screenLoc.y = -(boundingRect.top + window.pageYOffset - domElement.clientTop)
      this.circleExt.x = boundingRect.width;
      this.circleExt.y = -boundingRect.height;
      this.screenExt.x = boundingRect.width;
      this.screenExt.y = boundingRect.height;
    }
  }
}
