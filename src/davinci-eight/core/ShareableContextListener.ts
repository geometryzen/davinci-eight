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
    private _context: WebGLRenderer
    protected mirror: IContextProvider

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
     * @param visual {WebGLRenderer}
     * @return {void}
     */
    subscribe(visual: WebGLRenderer): void {
        if (!this._context) {
            visual.addRef()
            this._context = visual
            visual.addContextListener(this)
            visual.synchronize(this)
        }
        else {
            this.unsubscribe()
            this.subscribe(visual)
        }
    }

    /**
     * Instructs the consumer to unsubscribe from context events.
     *
     * @method unsubscribe
     * @return {void}
     */
    unsubscribe(): void {
        if (this.mirror) {
            cleanUp(this.mirror, this)
        }
        if (this._context) {
            this._context.removeContextListener(this)
            this._context.release()
            this._context = void 0
        }
    }

    contextFree(context: IContextProvider): void {
        this.mirror = void 0
    }

    contextGain(context: IContextProvider): void {
        this.mirror = context
    }

    contextLost(): void {
        this.mirror = void 0
    }

    get gl(): WebGLRenderingContext {
        if (this.mirror) {
            return this.mirror.gl
        }
        else {
            return void 0
        }
    }
    set gl(unused) {
        throw new Error(readOnly('gl').message)
    }
}
