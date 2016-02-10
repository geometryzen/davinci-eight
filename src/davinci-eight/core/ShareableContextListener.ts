import cleanUp from './cleanUp';
import IContextListener from './IContextListener'
import WebGLRenderer from './WebGLRenderer'
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
    private _renderer: WebGLRenderer
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
     * @param renderer {WebGLRenderer}
     * @return {void}
     */
    subscribe(renderer: WebGLRenderer): void {
        if (!this._renderer) {
            renderer.addRef()
            this._renderer = renderer
            renderer.addContextListener(this)
            renderer.synchronize(this)
        }
        else {
            this.unsubscribe()
            this.subscribe(renderer)
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
        if (this._renderer) {
            this._renderer.removeContextListener(this)
            this._renderer.release()
            this._renderer = void 0
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
