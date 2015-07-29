import AttributeProvider = require('../core/AttributeProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
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

function sphereMesh(options?: SphereOptions) : AttributeProvider {

  let base = new GeometryAdapter(sphereGeometry(options), adapterOptions(options));

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

export = sphereMesh;
