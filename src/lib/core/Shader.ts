import { Engine } from './Engine';
import { makeWebGLShader } from './makeWebGLShader';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeString } from '../checks/mustBeString';
import { mustBeUndefined } from '../checks/mustBeUndefined';
import { ShareableContextConsumer } from './ShareableContextConsumer';

/**
 *
 */
export class Shader extends ShareableContextConsumer {
    private _source: string;
    private _shaderType: number;
    private _shader: WebGLShader;
    constructor(source: string, type: number, engine: Engine) {
        super(engine);
        this.setLoggingName('Shader');
        this._source = mustBeString('source', source);
        this._shaderType = mustBeNumber('type', type);
    }

    destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
        mustBeUndefined(this.getLoggingName(), this._shader);
    }

    contextFree(): void {
        if (this._shader) {
            this.contextManager.gl.deleteShader(this._shader);
            this._shader = void 0;
        }
        super.contextFree();
    }

    contextGain(): void {
        this._shader = makeWebGLShader(this.contextManager.gl, this._source, this._shaderType);
        super.contextGain();
    }

    contextLost(): void {
        this._shader = void 0;
        super.contextLost();
    }
}
