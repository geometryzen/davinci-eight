import UniformProvider = require('../core/UniformProvider');
/**
 * @class UniformVariable
 */
interface UniformVariable<T> extends UniformProvider {
    /**
     * @property data
     * @type T
     */
    data: T;
    /**
     * @property callback
     * @type () => T
     */
    callback: () => T;
}
export = UniformVariable;
