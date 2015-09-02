import AttribProvider = require('../core/AttribProvider');
import DrawMode = require('../core/DrawMode');
import Geometry = require('../geometries/Geometry');
import GeometryAdapter = require('../geometries/GeometryAdapter');
import ArrowGeometry = require('../geometries/ArrowGeometry');
import adapterOptions = require('../mesh/adapterOptions');
import ArrowOptions = require('../mesh/ArrowOptions');
import Spinor3 = require('../math/Spinor3');
import Cartesian3 = require('../math/Cartesian3');

function arrowGeometry(options?: ArrowOptions): Geometry {
  options = options || {};
  let scale = 1;
  let attitude = new Spinor3();
  let segments = 12;
  let length = 1;
  let radiusShaft = 0.01;
  let radiusCone = 0.08;
  return new ArrowGeometry(
    scale,
    attitude,
    segments,
    length,
    radiusShaft,
    radiusCone,
    options.coneHeight,
    options.axis);
}

function arrowMesh(options?: ArrowOptions) : AttribProvider {

  let base = new GeometryAdapter(arrowGeometry(options), adapterOptions(options));
  var refCount: number = 0;

  let publicAPI: AttribProvider = {
    draw() {
      return base.draw();
    },
    update() {
      return base.update();
    },
    getAttribArray(name: string) {
      return base.getAttribArray(name);
    },
    getAttribData() {
      return base.getAttribData();
    },
    getAttribMeta() {
      return base.getAttribMeta();
    },
    get drawMode() {
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
    },
    addRef() {
      refCount++;
    },
    release() {
      refCount--;
      if (refCount === 0) {
        base.release();
      }
    },
    contextFree() {
      return base.contextFree();
    },
    contextGain(context: WebGLRenderingContext) {
      return base.contextGain(context);
    },
    contextLoss() {
      return base.contextLoss();
    },
    hasContext() {
      return base.hasContext();
    }
  };
  return publicAPI;
}

export = arrowMesh;
