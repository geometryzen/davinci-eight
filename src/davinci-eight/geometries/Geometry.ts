import DrawElements = require('../dfx/DrawElements');
import GeometryInfo = require('../dfx/GeometryInfo');

/**
 * @class Geometry
 */
class Geometry {
  public elements: DrawElements;
  public metadata: GeometryInfo;
  constructor(elements: DrawElements, metadata: GeometryInfo) {
    this.elements = elements;
    this.metadata = metadata;
  }
}

export = Geometry;
