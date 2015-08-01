import Color = require('../core/Color');
import UniformColor = require('../uniforms/UniformColor');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
declare class AmbientLight implements UniformProvider {
    private uColor;
    /**
     * @class AmbientLight
     * @constructor
     * @param options {{color?: Color; name?: string}}
     */
    constructor(options?: {
        color?: Color;
        name?: string;
    });
    color: UniformColor;
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
}
export = AmbientLight;
