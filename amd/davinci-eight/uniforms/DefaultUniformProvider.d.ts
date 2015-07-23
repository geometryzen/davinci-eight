import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 * @class DefaultUniformProvider
 */
declare class DefaultUniformProvider implements UniformProvider {
    /**
     * @class DefaultUniformProvider
     * @constructor
     */
    constructor();
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
     * @method getUniformVector2
     */
    getUniformVector2(name: string): number[];
    /**
     * @method getUniformVector3
     */
    getUniformVector3(name: string): number[];
    /**
     * @method getUniformVector4
     */
    getUniformVector4(name: string): number[];
    /**
     *
     * @method getUniformMetaInfos
     * @return An empty object that derived class may modify.
     */
    getUniformMetaInfos(): UniformMetaInfos;
}
export = DefaultUniformProvider;
