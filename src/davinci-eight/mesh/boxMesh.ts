import AttribProvider = require('../core/AttribProvider');
import DrawMode = require('../core/DrawMode');
import Geometry = require('../geometries/Geometry');
import GeometryAdapter = require('../geometries/GeometryAdapter');
import BoxGeometry = require('../geometries/BoxGeometry');
import adapterOptions = require('../mesh/adapterOptions');
import BoxOptions = require('../mesh/BoxOptions');

function boxGeometry(options?: BoxOptions): Geometry {
  options = options || {};
  return new BoxGeometry(
    options.width,
    options.height,
    options.depth,
    options.widthSegments,
    options.heightSegments,
    options.depthSegments,
    options.wireFrame);
}

function boxMesh(options?: BoxOptions) : AttribProvider {

  let base = new GeometryAdapter(boxGeometry(options), adapterOptions(options));

  let publicAPI: AttribProvider = {
    draw(context: WebGLRenderingContext) {
      return base.draw(context);
    },
    update() {
      return base.update();
    },
    getAttribArray(name: string) {
      return base.getAttribArray(name);
    },
    getAttribMeta() {
      return base.getAttribMeta();
    },
    get drawMode(): DrawMode {
      return base.drawMode;
    },
    set drawMode(value: DrawMode) {
      base.drawMode = value;
    },
    get dynamic() {
      return base.dynamic;
    },
    hasElementArray() {
      return base.hasElementArray();
    },
    getElementArray() {
      return base.getElementArray();
    }
  };
  return publicAPI;
}

export = boxMesh;
