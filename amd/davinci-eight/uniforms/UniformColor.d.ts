import Color = require('../core/Color');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformVariable = require('../uniforms/UniformVariable');
/**
 * Provides a uniform variable representing an ambient light.
 * @class UniformColor
 */
declare class UniformColor extends DefaultUniformProvider implements UniformVariable<Color> {
    private inner;
    /**
     * @class UniformColor
     * @constructor
     */
    constructor(name: string, id?: string);
    value: Color;
    callback: () => Color;
    getUniformVector4(name: string): number[];
    getUniformMetaInfos(): UniformMetaInfos;
}
export = UniformColor;
