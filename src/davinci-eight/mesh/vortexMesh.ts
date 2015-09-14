import AttribProvider = require('../core/AttribProvider');
import DrawMode = require('../core/DrawMode');
import Geometry3 = require('../geometries/Geometry3');
import GeometryAdapter = require('../geometries/GeometryAdapter');
import VortexGeometry = require('../geometries/VortexGeometry');
import adapterOptions = require('../mesh/adapterOptions');
import checkMeshArgs = require('../mesh/checkMeshArgs');
import ContextManager = require('../core/ContextManager');

function vortexGeometry(options: {wireFrame: boolean}): Geometry3 {
  return new VortexGeometry();
}

function vortexMesh(
  monitor: ContextManager,
  options?: {
    wireFrame?: boolean
  }) : AttribProvider {

  let checkedOptions = checkMeshArgs(options);

  let base = new GeometryAdapter(monitor, vortexGeometry(checkedOptions), adapterOptions(checkedOptions));
  var refCount = 1;

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

export = vortexMesh;
