import ContextProvider from './ContextProvider';
import {Engine} from './Engine';
import makeWebGLShader from './makeWebGLShader';
import mustBeUndefined from '../checks/mustBeUndefined';
import {ShareableContextConsumer} from './ShareableContextConsumer';

/**
 * @module EIGHT
 * @submodule core
 * @class ShareableWebGLShader
 */
export default class ShareableWebGLShader extends ShareableContextConsumer {
    private _source: string;
    private _shaderType: number;
    private _shader: WebGLShader;
    constructor(engine: Engine) {
        super(engine)
    }
    /**
     * @method destructor
     * @param levelUp {number}
     * @return {void}
     */
    destructor(levelUp: number): void {
        super.destructor(levelUp + 1)
        mustBeUndefined(this._type, this._shader)
    }
    contextFree(context: ContextProvider): void {
        if (this._shader) {
            context.gl.deleteShader(this._shader)
            this._shader = void 0
        }
        super.contextFree(context)
    }
    contextGain(context: ContextProvider): void {
        this._shader = makeWebGLShader(context.gl, this._source, this._shaderType)
        super.contextGain(context)
    }
    contextLost(): void {
        this._shader = void 0
        super.contextLost()
    }
}
