import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import AttribProvider = require('../core/AttribProvider');
import DataUsage = require('../core/DataUsage');
declare class IdentityAttribProvider implements AttribProvider {
    drawMode: any;
    dynamic: any;
    protected _context: WebGLRenderingContext;
    constructor();
    draw(): void;
    update(): void;
    getAttribArray(name: string): {
        usage: DataUsage;
        data: Float32Array;
    };
    getAttribData(): AttribDataInfos;
    getAttribMeta(): AttribMetaInfos;
    hasElementArray(): boolean;
    getElementArray(): {
        usage: DataUsage;
        data: Uint16Array;
    };
    addRef(): void;
    release(): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    hasContext(): boolean;
}
export = IdentityAttribProvider;
