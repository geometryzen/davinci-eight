import UniformData = require('../core/UniformData');
import UniformMetaInfos = require('../core/UniformMetaInfos');
/**
 * Provides the runtime and design time data required to use a uniform in a vertex shader.
 * @class UniformProvider
 */
interface UniformProvider extends UniformData {
    /**
     * @method getUniformMeta
     */
    getUniformMeta(): UniformMetaInfos;
}
export = UniformProvider;
