import AttribMetaInfo = require('../core/AttribMetaInfo');
/**
 *
 */
interface ShaderAttribSetter {
    (data: WebGLBuffer, meta: AttribMetaInfo): void;
}
export = ShaderAttribSetter;
