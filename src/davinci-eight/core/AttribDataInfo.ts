import VertexBuffer = require('../core/VertexBuffer');

interface AttribDataInfo {
  /**
   *
   */
  buffer: VertexBuffer;
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