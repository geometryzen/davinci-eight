/**
 * @module EIGHT
 * @submodule core
 */

/**
 * <p>
 * Symbolic constants for the <code>EIGHT.errorMode</code> property.
 * </p>
 *
 * @class ErrorMode
 *
 * @example
 *     EIGHT.errorMode = EIGHT.ErrorMode.WARNME
 */
enum ErrorMode {
  /**
   * @attribute STRICT
   * @type number
   */
  STRICT,

  /**
   * @attribute IGNORE
   * @type number
   */
  IGNORE,

  /**
   * @attribute WARNME
   * @type number
   */
  WARNME
}

export default ErrorMode
