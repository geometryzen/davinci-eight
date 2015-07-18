import Color = require('../core/Color');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import VertexUniformProvider = require('../core/VertexUniformProvider');
/**
 * Provides a uniform variable representing an ambient light.
 * @class AmbientLight
 */
declare class AmbientLight implements VertexUniformProvider {
    color: Color;
    /**
     * @class AmbientLight
     * @constructor
     */
    constructor(color: Color);
    getUniformVector3(name: string): Vector3;
    getUniformMatrix3(name: string): any;
    getUniformMatrix4(name: string): any;
    getUniformMetaInfos(): UniformMetaInfos;
}
export = AmbientLight;
