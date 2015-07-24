import Color = require('../core/Color');
import UniformColor = require('../uniforms/UniformColor');
/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
declare class AmbientLight extends UniformColor {
    /**
     * @class AmbientLight
     * @constructor
     */
    constructor(color: Color);
}
export = AmbientLight;
