import IBuffer = require('../core/IBuffer');

// FIXME: Probably should extend IResource to allow buffer to be rebuilt?
// FIXME: This appears to expose too much, but might be a ContentManager implementation detail?

/**
 * @interface AttribDataInfo
 */
interface AttribDataInfo {
  /**
   *
   */
  buffer: IBuffer;
  /**
   * The number of components per vertex attribute.
   */
  size: number,
  /**
   *
   */
  normalized?: boolean,
  /**
   *
   */
  stride?: number,
  /**
   *
   */
  offset?: number
}

export = AttribDataInfo;