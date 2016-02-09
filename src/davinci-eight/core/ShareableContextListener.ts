import cleanUp from './cleanUp';
import IContextListener from './IContextListener'
import IContextMonitor from './IContextMonitor'
import IContextProvider from './IContextProvider'
import readOnly from '../i18n/readOnly';
import Shareable from './Shareable';

/**
 * @module EIGHT
 * @submodule core
 * @class ShareableContextListener
 * @extends Shareable
 */
export default class ShareableContextListener extends Shareable implements IContextListener {
    private _monitor: IContextMonitor
    private _context: IContextProvider

    /**
     * @class ShareableContextListener
     * @constructor
     * @param type {string}
     */
    constructor(type: string) {
        super(type)
    }

    /**
     * @method destructor
     * @return {void}
     */
    protected destructor(): void {
        this.unsubscribe()
        super.destructor()
    }

    /**
     * Instructs the consumer to subscribe to context events.
     *
     * @method subscribe
     * @param monitor {IContextMonitor}
     * @return {void}
     */
    subscribe(monitor: IContextMonitor): void {
        if (!this._monitor) {
            monitor.addRef()
            this._monitor = monitor
            monitor.addContextListener(this)
            monitor.synchronize(this)
        }
        else {
            this.unsubscribe()
            this.subscribe(monitor)
        }
    }

    /**
     * Instructs the consumer to unsubscribe from context events.
     *
     * @method unsubscribe
     * @return {void}
     */
    unsubscribe(): void {
        if (this._context) {
            cleanUp(this._context, this)
        }
        if (this._monitor) {
            this._monitor.removeContextListener(this)
            this._monitor.release()
            this._monitor = void 0
        }
    }

    contextFree(context: IContextProvider): void {
        this._context = void 0
    }

    contextGain(context: IContextProvider): void {
        this._context = context
    }

    contextLost(): void {
        this._context = void 0
    }

    get gl(): WebGLRenderingContext {
        if (this._context) {
            return this._context.gl
        }
        else {
            return void 0
        }
    }
    set gl(unused) {
        throw new Error(readOnly('gl').message)
    }
}
