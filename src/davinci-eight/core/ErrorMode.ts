/**
 * @module EIGHT
 * @submodule core
 */

/**
 * <p>
 * Symbolic constants for the <code>EIGHT.errorMode</code> property.
 * </p>
 * <p>
 * The setting of <code>EIGHT.errorMode</code> determines how the <code>EIGHT</code>
 * implementation handles error conditions. Choose the mode that best suits your workflow.
 * </p>
 *
 * @class ErrorMode
 *
 * @example
 *     EIGHT.errorMode = EIGHT.ErrorMode.WARNME
 */
enum ErrorMode {

  /**
   * In <code>STRICT</code> mode, the implementation will </code>throw</code> <code>Error</code>s.
   * The implementation will operate according to the API specification.
   *
   * @attribute STRICT
   * @type number
   */
  STRICT,

  /**
   * In <code>IGNORE</code> mode, the implementation will try to continue.
   * The results may be unpredictable.
   * The implementation will not report errors to the </code>console</code>.
   *
   * @attribute IGNORE
   * @type number
   */
  IGNORE,

  /**
   * In <code>WARNME</code> mode, the implementaion will try to continue.
   * The results may be unpredictable.
   * The implementation <em>will</em> report warnings to the </code>console</code>.
   *
   * @attribute WARNME
   * @type number
   */
  WARNME
}

export default ErrorMode
