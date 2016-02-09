import IContextProvider from './IContextProvider';
import mustBeUndefined from '../checks/mustBeUndefined';
import ShareableContextListener from './ShareableContextListener';

/**
 * @module EIGHT
 * @submodule core
 * @class ShareableWebGLTexture
 * @extends ShareableContextListener
 */
export default class ShareableWebGLTexture extends ShareableContextListener {
    private _texture: WebGLTexture
    private _target: number
    constructor(target: number) {
        super('ShareableWebGLTexture')
        this._target = target
    }
    protected destructor(): void {
        super.destructor()
        mustBeUndefined(this._type, this._texture)
    }
    contextFree(context: IContextProvider) {
        if (this._texture) {
            this.gl.deleteTexture(this._texture)
            this._texture = void 0
        }
        super.contextFree(context)
    }
    contextGain(context: IContextProvider) {
        this._texture = context.gl.createTexture()
        super.contextGain(context)
    }
    contextLost() {
        this._texture = void 0
        super.contextLost()
    }

    /**
     * @method bind
     */
    bind() {
        if (this.gl) {
            this.gl.bindTexture(this._target, this._texture)
        }
        else {
            console.warn(`${this._type}.bind() missing WebGL rendering context.`)
        }
    }

    /**
     * @method unbind
     */
    unbind() {
        if (this.gl) {
            this.gl.bindTexture(this._target, null)
        }
        else {
            console.warn(`${this._type}.unbind() missing WebGL rendering context.`)
        }
    }
}
