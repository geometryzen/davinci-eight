import UniformMetaInfos = require('../core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import VertexUniformProvider = require('../core/VertexUniformProvider');
declare class ChainedVertexUniformProvider implements VertexUniformProvider {
    private provider;
    private fallback;
    constructor(provider: VertexUniformProvider, fallback: VertexUniformProvider);
    getUniformMatrix3(name: string): {
        transpose: boolean;
        matrix3: Float32Array;
    };
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
    getUniformVector3(name: string): Vector3;
    getUniformMetaInfos(): UniformMetaInfos;
}
export = ChainedVertexUniformProvider;
