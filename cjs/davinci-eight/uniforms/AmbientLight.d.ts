import Color = require('../core/Color');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
declare class AmbientLight extends DefaultUniformProvider {
    color: Color;
    /**
     * @class AmbientLight
     * @constructor
     */
    constructor(color: Color);
    getUniformVector3(name: string): number[];
    getUniformMetaInfos(): UniformMetaInfos;
}
export = AmbientLight;
