import { ContextManager } from './ContextManager';
import { DataType } from './DataType';
import { PixelFormat } from './PixelFormat';
import { Texture } from './Texture';
import { TextureTarget } from './TextureTarget';

export class ImageTexture extends Texture {
    constructor(private image: HTMLImageElement, target: TextureTarget, contextManager: ContextManager, levelUp = 0) {
        super(target, contextManager, levelUp + 1);
        this.setLoggingName('ImageTexture');
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    get naturalHeight(): number {
        if (this.image) {
            return this.image.naturalHeight;
        }
        else {
            return void 0;
        }
    }

    get naturalWidth(): number {
        if (this.image) {
            return this.image.naturalWidth;
        }
        else {
            return void 0;
        }
    }

    upload(): void {
        if (this.gl) {
            this.gl.texImage2D(this._target, 0, PixelFormat.RGBA, PixelFormat.RGBA, DataType.UNSIGNED_BYTE, this.image);
        }
        else {
            console.warn(`${this.getLoggingName()}.upload() missing WebGL rendering context.`);
        }
    }
}
