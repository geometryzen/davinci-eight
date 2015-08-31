import UniformDataInfos = require('../core/UniformDataInfos');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformProvider = require('../core/UniformProvider');
declare class ChainedUniformProvider implements UniformProvider {
    private provider;
    private fallback;
    constructor(provider: UniformProvider, fallback: UniformProvider);
    getUniformFloat(name: string): number;
    getUniformMatrix2(name: string): {
        transpose: boolean;
        matrix2: Float32Array;
    };
    getUniformMatrix3(name: string): {
        transpose: boolean;
        matrix3: Float32Array;
    };
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
    getUniformVector2(name: string): number[];
    getUniformVector3(name: string): number[];
    getUniformVector4(name: string): number[];
    getUniformMeta(): UniformMetaInfos;
    getUniformData(): UniformDataInfos;
}
export = ChainedUniformProvider;
