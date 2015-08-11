import Color = require('../core/Color');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../core/DefaultUniformProvider');
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
    data: Color;
    callback: () => Color;
    getUniformVector3(name: string): number[];
    getUniformMeta(): UniformMetaInfos;
}
export = UniformColor;
