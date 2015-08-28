import AttribProvider = require('../core/AttribProvider');
import DrawMode = require('../core/DrawMode');
import Geometry = require('../geometries/Geometry');
import GeometryAdapter = require('../geometries/GeometryAdapter');
import VortexGeometry = require('../geometries/VortexGeometry');
import adapterOptions = require('../mesh/adapterOptions');
import checkMeshArgs = require('../mesh/checkMeshArgs');

function vortexGeometry(options: {wireFrame: boolean}): Geometry {
  return new VortexGeometry();
}

function vortexMesh(
  options?: {
    wireFrame?: boolean
  }) : AttribProvider {

  let checkedOptions = checkMeshArgs(options);

  let base = new GeometryAdapter(vortexGeometry(checkedOptions), adapterOptions(checkedOptions));

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

export = vortexMesh;
