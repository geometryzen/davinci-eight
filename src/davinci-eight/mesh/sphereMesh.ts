import AttribProvider = require('../core/AttribProvider');
import DrawMode = require('../core/DrawMode');
import Geometry = require('../geometries/Geometry');
import GeometryAdapter = require('../geometries/GeometryAdapter');
import SphereGeometry = require('../geometries/SphereGeometry');
import adapterOptions = require('../mesh/adapterOptions');
import SphereOptions = require('../mesh/SphereOptions');

function sphereGeometry(options?: SphereOptions): Geometry {
  options = options || {};
  return new SphereGeometry(
    options.radius,
    options.widthSegments,
    options.heightSegments,
    options.phiStart,
    options.phiLength,
    options.thetaStart,
    options.thetaLength);
}

function sphereMesh(options?: SphereOptions) : AttribProvider {

  let base = new GeometryAdapter(sphereGeometry(options), adapterOptions(options));

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

export = sphereMesh;
