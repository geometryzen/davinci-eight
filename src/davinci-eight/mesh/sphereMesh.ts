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
  var refCount: number = 1;

  let publicAPI: AttribProvider = {
    draw() {
      return base.draw();
    },
    update() {
      return base.update();
    },
    getAttribData() {
      return base.getAttribData();
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
    addRef(): number {
      refCount++;
      return refCount;
    },
    release(): number {
      refCount--;
      if (refCount === 0) {
        base.release();
        base = void 0;
      }
      return refCount;
    },
    contextFree() {
      return base.contextFree();
    },
    contextGain(context: WebGLRenderingContext) {
      return base.contextGain(context);
    },
    contextLoss() {
      return base.contextLoss();
    }
  };
  return publicAPI;
}

export = sphereMesh;
