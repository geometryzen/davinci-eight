import { ContextManager } from './ContextManager';
import { mustBeUndefined } from '../checks/mustBeUndefined';
import { ShareableContextConsumer } from './ShareableContextConsumer';
import { TextureMagFilter } from './TextureMagFilter';
import { TextureMinFilter } from './TextureMinFilter';
import { TextureParameterName } from './TextureParameterName';
import { TextureTarget } from './TextureTarget';
import { TextureWrapMode } from './TextureWrapMode';

export class Texture extends ShareableContextConsumer {
    private _texture: WebGLTexture;
    protected _target: TextureTarget;
    constructor(target: TextureTarget, contextManager: ContextManager, levelUp = 0) {
        super(contextManager);
        this.setLoggingName('Texture');
        this._target = target;
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
        mustBeUndefined(this.getLoggingName(), this._texture);
    }

    contextFree() {
        if (this._texture) {
            this.gl.deleteTexture(this._texture);
            this._texture = void 0;
            super.contextFree();
        }
    }

    contextGain() {
        if (!this._texture) {
            super.contextGain();
            this._texture = this.contextManager.gl.createTexture();
        }
    }

    contextLost() {
        this._texture = void 0;
        super.contextLost();
    }

    /**
     *
     */
    bind(): void {
        if (this.gl) {
            this.gl.bindTexture(this._target, this._texture);
        }
        else {
            console.warn(`${this.getLoggingName()}.bind() missing WebGL rendering context.`);
        }
    }

    /**
     *
     */
    unbind(): void {
        if (this.gl) {
            this.gl.bindTexture(this._target, null);
        }
        else {
            console.warn(`${this.getLoggingName()}.unbind() missing WebGL rendering context.`);
        }
    }

    get minFilter(): TextureMinFilter {
        throw new Error('minFilter is write-only');
    }
    set minFilter(filter: TextureMinFilter) {
        if (this.gl) {
            this.bind();
            this.gl.texParameteri(this._target, TextureParameterName.TEXTURE_MIN_FILTER, filter);
            this.unbind();
        }
        else {
            console.warn(`${this.getLoggingName()}.minFilter missing WebGL rendering context.`);
        }
    }

    get magFilter(): TextureMagFilter {
        throw new Error('magFilter is write-only');
    }
    set magFilter(filter: TextureMagFilter) {
        if (this.gl) {
            this.bind();
            this.gl.texParameteri(this._target, TextureParameterName.TEXTURE_MAG_FILTER, filter);
            this.unbind();
        }
        else {
            console.warn(`${this.getLoggingName()}.magFilter missing WebGL rendering context.`);
        }
    }

    get wrapS(): TextureWrapMode {
        throw new Error('wrapS is write-only');
    }
    set wrapS(mode: TextureWrapMode) {
        if (this.gl) {
            this.bind();
            this.gl.texParameteri(this._target, TextureParameterName.TEXTURE_WRAP_S, mode);
            this.unbind();
        }
        else {
            console.warn(`${this.getLoggingName()}.wrapS missing WebGL rendering context.`);
        }
    }

    get wrapT(): TextureWrapMode {
        throw new Error('wrapT is write-only');
    }
    set wrapT(mode: TextureWrapMode) {
        if (this.gl) {
            this.bind();
            this.gl.texParameteri(this._target, TextureParameterName.TEXTURE_WRAP_T, mode);
            this.unbind();
        }
        else {
            console.warn(`${this.getLoggingName()}.wrapT missing WebGL rendering context.`);
        }
    }

    /**
     * 
     */
    upload(): void {
        throw new Error(`${this.getLoggingName()}.upload() must be implemented.`);
    }
}
