import AttributeProvider = require('../core/AttributeProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import DrawMode = require('../core/DrawMode');
import Geometry = require('../geometries/Geometry');
import GeometryAdapter = require('../geometries/GeometryAdapter');
import ArrowGeometry = require('../geometries/ArrowGeometry');
import adapterOptions = require('../mesh/adapterOptions');
import checkMeshArgs = require('../mesh/checkMeshArgs');

function arrowGeometry(options: {wireFrame: boolean}): Geometry {
  return new ArrowGeometry();
}

function arrowMesh(
  options?: {
    wireFrame?: boolean
  }) : AttributeProvider {

  let checkedOptions = checkMeshArgs(options);

  let base = new GeometryAdapter(arrowGeometry(checkedOptions), adapterOptions(checkedOptions));

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
    dynamics() {
      return base.dynamics();
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

export = arrowMesh;
