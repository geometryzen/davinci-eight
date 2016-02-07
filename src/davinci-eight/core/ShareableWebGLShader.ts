import IContextProvider from './IContextProvider';
import makeWebGLShader from './makeWebGLShader';
import mustBeUndefined from '../checks/mustBeUndefined';
import ShareableContextListener from './ShareableContextListener';

/**
 * Under Construction
 * Intentionally Undocumented
 */
export default class ShareableWebGLShader extends ShareableContextListener {
    private _source: string;
    private _shaderType: number;
    private _shader: WebGLShader;
    constructor() {
        super('ShareableWebGLShader')
    }
    destructor(): void {
        super.destructor()
        mustBeUndefined(this._type, this._shader)
    }
    contextFree(context: IContextProvider): void {
        if (this._shader) {
            context.gl.deleteShader(this._shader)
            this._shader = void 0
        }
        super.contextFree(context)
    }
    contextGain(context: IContextProvider): void {
        this._shader = makeWebGLShader(context.gl, this._source, this._shaderType)
        super.contextGain(context)
    }
    contextLost(): void {
        this._shader = void 0
        super.contextLost()
    }
}
