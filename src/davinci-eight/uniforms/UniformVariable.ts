import UniformProvider = require('../core/UniformProvider');
/**
 * @class UniformVariable
 */
interface UniformVariable<T> extends UniformProvider {
  /**
   * @property value
   * @type T
   */
  value: T;
  /**
   * @property callback
   * @type () => T
   */
  callback: () => T;
}

export = UniformVariable;