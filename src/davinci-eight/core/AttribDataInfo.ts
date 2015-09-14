import Buffer = require('../core/Buffer');

interface AttribDataInfo {
  /**
   *
   */
  buffer: Buffer;
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