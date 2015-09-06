import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import AttribProvider = require('../core/AttribProvider');
declare class IdentityAttribProvider implements AttribProvider {
    drawMode: any;
    dynamic: any;
    protected _context: WebGLRenderingContext;
    constructor();
    draw(): void;
    update(): void;
    getAttribData(): AttribDataInfos;
    getAttribMeta(): AttribMetaInfos;
    addRef(): void;
    release(): void;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
}
export = IdentityAttribProvider;
