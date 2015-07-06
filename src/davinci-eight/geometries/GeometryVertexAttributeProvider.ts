/// <reference path='../geometries/AttributeMetaInfos'/>
/// <reference path='../geometries/VertexAttributeProvider'/>
import Geometry = require('../geometries/Geometry');
class GeometryVertexAttributeProvider<G extends Geometry> implements VertexAttributeProvider {
  public geometry: G
  constructor(geometry: G) {

  }
  draw(context: WebGLRenderingContext): void {

  }
  dynamic(): boolean {
    return true;
  }
  hasElements(): boolean {
    return false;
  }
  getElements(): Uint16Array {
    return null;
  }
  getVertexAttributeData(name: string): Float32Array {
    return null;
  }
  getAttributeMetaInfos(): AttributeMetaInfos {
    return null;
  }
  update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void {

  }
}

export = GeometryVertexAttributeProvider;
