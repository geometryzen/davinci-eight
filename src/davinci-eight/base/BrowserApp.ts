import BrowserWindow from './BrowserWindow'
import isDefined from '../checks/isDefined'
import isFunction from '../checks/isFunction'
import isUndefined from '../checks/isUndefined'
import Shareable from '../core/Shareable'
import ShareableArray from '../collections/ShareableArray'
import mustBeFunction from '../checks/mustBeFunction'
import mustBeObject from '../checks/mustBeObject'
import mustBeUndefined from '../checks/mustBeUndefined'
import refChange from '../core/refChange'

/**
 * @class BrowserApp
 */
export default class BrowserApp {

  /**
   * @property window
   * @type Window
   * @protected
   */
  protected window: BrowserWindow
  private shutDown: (ev: Event) => void
  private domLoaded: EventListener

  /**
   * @property managed
   * @type ShareableArray
   * @private
   */
  private managed: ShareableArray<Shareable>

  /**
   * @class BrowserApp
   * @constructor
   * @param [wnd = window] {Window}
   */
  constructor(wnd: BrowserWindow = window) {
    refChange('start')
    this.window = wnd
    this.domLoaded = () => {
      this.window.document.removeEventListener('DOMContentLoaded', this.domLoaded)
      this.domLoaded = void 0
      this.shutDown = (ev: Event) => {
        // The shutDown handler has done its job, remove the listener.
        wnd.removeEventListener('unload', this.shutDown)
        this.shutDown = void 0
        mustBeUndefined('shutDown', this.shutDown)
        mustBeUndefined('domLoaded', this.domLoaded)
        this.destructor()
        if (isDefined(this.managed)) {
          // The derived class has overridden the destructor but has not called
          // the super class destructor method.
          console.warn("You must call super.destructor() as the last statement in your BroswerApp-derived class.")
          this.managed.release()
          this.managed = void 0
        }
      }
      mustBeObject('window', this.window)
      mustBeFunction('shutDown', this.shutDown)
      mustBeUndefined('domLoaded', this.domLoaded)
      this.window.addEventListener('unload', this.shutDown)
      this.initialize()
    }
    // Now we just wait until the DOM has finished loading.
    mustBeObject('window', this.window)
    mustBeUndefined('shutDown', this.shutDown)
    mustBeFunction('domLoaded', this.domLoaded)
    wnd.document.addEventListener('DOMContentLoaded', this.domLoaded)
  }

  /**
   * @method isWaiting
   * @return {boolean}
   */
  public isWaiting(): boolean {
    return isFunction(this.domLoaded)
  }

  /**
   * @method isRunning
   * @return {boolean}
   */
  public isRunning(): boolean {
    return isFunction(this.shutDown)
  }

  /**
   * @method isZombie
   * @return {boolean}
   */
  public isZombie(): boolean {
    return isUndefined(this.shutDown) && isUndefined(this.domLoaded)
  }

  /**
   * <p>
   * Transfers ownership of the shareable object to this <code>BrowserApp</code>.
   * </p>
   * <p>
   * All managed objects will be released in the <code>BrowserApp.destructor</code> method.
   * </p>
   * <p>
   * You must not call <code>release()</code> on the object you are transferring.
   * </p>
   *
   * @method manage
   * @param managed {Shareable}
   * @return {void}
   */
  public manage(managed: Shareable): void {
    if (this.managed) {
      this.managed.pushWeakRef(managed)
    }
    else {
      throw new Error("You must call super.initialize() as the first statement in your BroswerApp-derived initialize method.")
    }
  }

  /**
   * @method initialize
   * @return {void}
   * @protected
   */
  protected initialize(): void {
    if (isUndefined(this.managed)) {
      this.managed = new ShareableArray()
    }
  }

  /**
   * @method destructor
   * @return {void}
   * @protected
   */
  protected destructor(): void {
    if (this.managed) {
      this.managed.release()
      this.managed = void 0
    }
    refChange('stop')
    refChange('dump')
  }
}