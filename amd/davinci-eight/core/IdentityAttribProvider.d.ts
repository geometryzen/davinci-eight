import AttribMetaInfos = require('../core/AttribMetaInfos');
import AttribProvider = require('../core/AttribProvider');
import DataUsage = require('../core/DataUsage');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
declare class IdentityAttribProvider implements AttribProvider {
    drawMode: any;
    dynamic: any;
    constructor();
    draw(context: WebGLRenderingContext): void;
    update(attributes: ShaderVariableDecl[]): void;
    getAttribArray(name: string): {
        usage: DataUsage;
        data: Float32Array;
    };
    getAttribMeta(): AttribMetaInfos;
    hasElementArray(): boolean;
    getElementArray(): {
        usage: DataUsage;
        data: Uint16Array;
    };
}
export = IdentityAttribProvider;
