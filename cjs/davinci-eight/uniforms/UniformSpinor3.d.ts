import Spinor3 = require('../math/Spinor3');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformVariable = require('../uniforms/UniformVariable');
/**
 * Provides a uniform variable representing an ambient light.
 * @class UniformSpinor3
 */
declare class UniformSpinor3 extends DefaultUniformProvider implements UniformVariable<Spinor3> {
    private inner;
    /**
     * @class UniformSpinor3
     * @constructor
     */
    constructor(name: string, id?: string);
    data: Spinor3;
    callback: () => Spinor3;
    getUniformVector4(name: string): number[];
    getUniformMeta(): UniformMetaInfos;
}
export = UniformSpinor3;
