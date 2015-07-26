import AttributeProvider = require('../core/AttributeProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
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
  }) : AttributeProvider {

  let checkedOptions = checkMeshArgs(options);

  let base = new GeometryAdapter(vortexGeometry(checkedOptions), adapterOptions(checkedOptions));

  let publicAPI: AttributeProvider = {
    draw(context: WebGLRenderingContext) {
      return base.draw(context);
    },
    update(attributes: ShaderVariableDecl[]) {
      return base.update(attributes);
    },
    getVertexAttributeData(name: string) {
      return base.getVertexAttributeData(name);
    },
    getAttributeMetaInfos() {
      return base.getAttributeMetaInfos();
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
    hasElements() {
      return base.hasElements();
    },
    getElements() {
      return base.getElements();
    }
  };
  return publicAPI;
}

export = vortexMesh;
