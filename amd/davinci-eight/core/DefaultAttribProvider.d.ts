import AttribMetaInfos = require('../core/AttribMetaInfos');
import IdentityAttribProvider = require('../core/IdentityAttribProvider');
declare class DefaultAttribProvider extends IdentityAttribProvider {
    constructor();
    draw(): void;
    update(): void;
    getAttribMeta(): AttribMetaInfos;
}
export = DefaultAttribProvider;
