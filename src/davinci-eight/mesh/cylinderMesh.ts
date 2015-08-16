import AttribProvider = require('../core/AttribProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import DrawMode = require('../core/DrawMode');
import Geometry = require('../geometries/Geometry');
import GeometryAdapter = require('../geometries/GeometryAdapter');
import CylinderGeometry = require('../geometries/CylinderGeometry');
import adapterOptions = require('../mesh/adapterOptions');
import CylinderOptions = require('../mesh/CylinderOptions');

function cylinderGeometry(options?: CylinderOptions): Geometry {
  options = options || {};
  return new CylinderGeometry(
    options.radiusTop,
    options.radiusBottom,
    options.height,
    options.radialSegments,
    options.heightSegments,
    options.openEnded,
    options.thetaStart,
    options.thetaLength);
}

function cylinderMesh(options?: CylinderOptions) : AttribProvider {

  let base = new GeometryAdapter(cylinderGeometry(options), adapterOptions(options));

  let publicAPI: AttribProvider = {
    draw(context: WebGLRenderingContext) {
      return base.draw(context);
    },
    update(attributes: ShaderVariableDecl[]) {
      return base.update(attributes);
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

export = cylinderMesh;
