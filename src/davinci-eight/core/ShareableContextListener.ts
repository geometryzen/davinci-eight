import cleanUp from './cleanUp';
import IContextListener from './IContextListener'
import Engine from './Engine'
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
    private _context: Engine
    protected contextProvider: IContextProvider

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
     * @param context {Engine}
     * @return {void}
     */
    subscribe(context: Engine): void {
        if (!this._context) {
            context.addRef()
            this._context = context
            context.addContextListener(this)
            context.synchronize(this)
        }
        else {
            this.unsubscribe()
            this.subscribe(context)
        }
    }

    /**
     * Instructs the consumer to unsubscribe from context events.
     *
     * @method unsubscribe
     * @return {void}
     */
    unsubscribe(): void {
        if (this.contextProvider) {
            cleanUp(this.contextProvider, this)
        }
        if (this._context) {
            this._context.removeContextListener(this)
            this._context.release()
            this._context = void 0
        }
    }

    contextFree(context: IContextProvider): void {
        this.contextProvider = void 0
    }

    contextGain(context: IContextProvider): void {
        this.contextProvider = context
    }

    contextLost(): void {
        this.contextProvider = void 0
    }

    get gl(): WebGLRenderingContext {
        if (this.contextProvider) {
            return this.contextProvider.gl
        }
        else {
            return void 0
        }
    }
    set gl(unused) {
        throw new Error(readOnly('gl').message)
    }
}
