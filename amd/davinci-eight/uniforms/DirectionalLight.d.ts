import Color = require('../core/Color');
import UniformColor = require('../uniforms/UniformColor');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Cartesian3 = require('../math/Cartesian3');
/**
 * Provides a uniform variable representing a directional light.
 * @class DirectionalLight
 */
declare class DirectionalLight implements UniformProvider {
    private $uColor;
    private uDirection;
    private multi;
    /**
     * @class DirectionalLight
     * @constructor
     */
    constructor();
    uColor: UniformColor;
    color: Color;
    direction: Cartesian3;
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
