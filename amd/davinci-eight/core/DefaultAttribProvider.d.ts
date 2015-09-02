import AttribMetaInfos = require('../core/AttribMetaInfos');
import IdentityAttribProvider = require('../core/IdentityAttribProvider');
import DataUsage = require('../core/DataUsage');
declare class DefaultAttribProvider extends IdentityAttribProvider {
    constructor();
    draw(): void;
    update(): void;
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
export = DefaultAttribProvider;
