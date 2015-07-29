import AttributeProvider = require('../core/AttributeProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
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
  let lengthCone = 0.20;
  let axis: Cartesian3 = options.axis;
  return new ArrowGeometry(
    scale,
    attitude,
    segments,
    length,
    radiusShaft,
    radiusCone,
    lengthCone,
    axis);
}

function arrowMesh(options?: ArrowOptions) : AttributeProvider {

  let base = new GeometryAdapter(arrowGeometry(options), adapterOptions(options));

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

export = arrowMesh;
