import Color = require('../core/Color');
import UniformColor = require('../uniforms/UniformColor');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformProvider = require('../core/UniformProvider');
import UniformVector3 = require('../uniforms/UniformVector3');
import Vector3 = require('../math/Vector3');
/**
 * Provides a uniform variable representing a directional light.
 * @class DirectionalLight
 */
declare class DirectionalLight implements UniformProvider {
    private uColor;
    private uDirection;
    private multi;
    /**
     * @class DirectionalLight
     * @constructor
     */
    constructor(options?: {
        color?: Color;
        direction?: Vector3;
        name?: string;
    });
    color: UniformColor;
    direction: UniformVector3;
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
    getUniformMetaInfos(): UniformMetaInfos;
}
export = DirectionalLight;
