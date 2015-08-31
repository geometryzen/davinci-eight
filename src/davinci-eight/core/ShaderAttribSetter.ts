import AttribMetaInfo = require('../core/AttribMetaInfo');

// Maybe ShaderBufferSetter?
/**
 *
 */
interface ShaderAttribSetter {(data: WebGLBuffer, meta: AttribMetaInfo): void}

export = ShaderAttribSetter;
