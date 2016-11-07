import ContextProvider from './ContextProvider';
import ContextManager from './ContextManager';
import DataType from './DataType';
import mustBeUndefined from '../checks/mustBeUndefined';
import PixelFormat from './PixelFormat';
import { ShareableContextConsumer } from './ShareableContextConsumer';
import TextureMagFilter from './TextureMagFilter';
import TextureMinFilter from './TextureMinFilter';
import TextureParameterName from './TextureParameterName';
import TextureTarget from './TextureTarget';
import TextureWrapMode from './TextureWrapMode';

export default class Texture extends ShareableContextConsumer {
    private _texture: WebGLTexture;
    private _target: TextureTarget;
    public image: HTMLImageElement;
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
        mustBeUndefined(this._type, this._texture);
    }

    contextFree(contextProvider: ContextProvider) {
        if (this._texture) {
            this.gl.deleteTexture(this._texture)
            this._texture = void 0
        }
        super.contextFree(contextProvider)
    }

    contextGain(contextProvider: ContextProvider) {
        this._texture = contextProvider.gl.createTexture()
        super.contextGain(contextProvider)
    }

    contextLost() {
        this._texture = void 0
        super.contextLost()
    }

    /**
     *
     */
    bind(): void {
        if (this.gl) {
            this.gl.bindTexture(this._target, this._texture)
        }
        else {
            console.warn(`${this._type}.bind() missing WebGL rendering context.`)
        }
    }

    /**
     *
     */
    unbind(): void {
        if (this.gl) {
            this.gl.bindTexture(this._target, null)
        }
        else {
            console.warn(`${this._type}.unbind() missing WebGL rendering context.`)
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
            console.warn(`${this._type}.minFilter missing WebGL rendering context.`)
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
            console.warn(`${this._type}.magFilter missing WebGL rendering context.`)
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
            console.warn(`${this._type}.wrapS missing WebGL rendering context.`)
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
            console.warn(`${this._type}.wrapT missing WebGL rendering context.`)
        }
    }

    upload(): void {
        if (this.gl) {
            this.gl.texImage2D(this._target, 0, PixelFormat.RGBA, PixelFormat.RGBA, DataType.UNSIGNED_BYTE, this.image);
        }
        else {
            console.warn(`${this._type}.upload() missing WebGL rendering context.`)
        }
    }
}
