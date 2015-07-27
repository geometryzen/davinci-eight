import Vector3 = require('../math/Vector3');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformVariable = require('../uniforms/UniformVariable');
/**
 * Provides a uniform variable representing an ambient light.
 * @class UniformVector3
 */
declare class UniformVector3 extends DefaultUniformProvider implements UniformVariable<Vector3> {
    private inner;
    /**
     * @class UniformVector3
     * @constructor
     */
    constructor(name: string, id?: string);
    data: Vector3;
    callback: () => Vector3;
    getUniformVector3(name: string): number[];
    getUniformMetaInfos(): UniformMetaInfos;
}
export = UniformVector3;
