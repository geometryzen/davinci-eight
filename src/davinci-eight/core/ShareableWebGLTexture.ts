import ContextProvider from './ContextProvider';
import {Engine} from './Engine';
import mustBeUndefined from '../checks/mustBeUndefined';
import ShareableContextConsumer from './ShareableContextConsumer';

/**
 * @module EIGHT
 * @submodule core
 * @class ShareableWebGLTexture
 * @extends ShareableContextConsumer
 */
export default class ShareableWebGLTexture extends ShareableContextConsumer {
    private _texture: WebGLTexture
    private _target: number
    constructor(target: number, engine: Engine) {
        super(engine)
        this._target = target
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1)
        mustBeUndefined(this._type, this._texture)
    }
    contextFree(context: ContextProvider) {
        if (this._texture) {
            this.gl.deleteTexture(this._texture)
            this._texture = void 0
        }
        super.contextFree(context)
    }
    contextGain(context: ContextProvider) {
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
