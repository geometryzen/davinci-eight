import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformProvider = require('../core/UniformProvider');
declare class ChainedUniformProvider implements UniformProvider {
    private provider;
    private fallback;
    constructor(provider: UniformProvider, fallback: UniformProvider);
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
    getUniformMetaInfos(): UniformMetaInfos;
}
export = ChainedUniformProvider;
