import UniformMetaInfos = require('../core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
/**
 * Provides the runtime and design time data required to use a uniform in a vertex shader.
 * @class VertexUniformProvider
 */
interface VertexUniformProvider {
    /**
     * @method getUniformMatrix3
     */
    getUniformVector3(name: string): Vector3;
    /**
     * @method getUniformMatrix3
     */
    getUniformMatrix3(name: string): {
        transpose: boolean;
        matrix3: Float32Array;
    };
    /**
     * @method getUniformMatrix4
     */
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
    /**
     * @method getUniformMetaInfos
     */
    getUniformMetaInfos(): UniformMetaInfos;
}
export = VertexUniformProvider;
