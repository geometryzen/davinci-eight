import AttributeProvider = require('../core/AttributeProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import DrawMode = require('../core/DrawMode');
import Geometry = require('../geometries/Geometry');
import GeometryAdapter = require('../geometries/GeometryAdapter');
import BoxGeometry = require('../geometries/BoxGeometry');
import adapterOptions = require('../mesh/adapterOptions');

function boxGeometry(options: {
  width: number,
  height: number,
  depth: number,
  widthSegments: number,
  heightSegments: number,
  depthSegments: number,
  wireFrame: boolean
}): Geometry {
  return new BoxGeometry(
    options.width,
    options.height,
    options.depth,
    options.widthSegments,
    options.heightSegments,
    options.depthSegments,
    options.wireFrame);
}

function checkBoxArgs(
  options: {
    width?: number,
    height?: number,
    depth?: number,
    widthSegments?: number,
    heightSegments?: number,
    depthSegments?: number,
    wireFrame?: boolean
  }) {

  options = options || {};

  let width = typeof options.width === 'undefined' ? 1 : options.width;
  let height = typeof options.height === 'undefined' ? 1 : options.height;
  let depth = typeof options.depth === 'undefined' ? 1 : options.depth;
  let widthSegments = typeof options.widthSegments === 'undefined' ? 1 : options.widthSegments;
  let heightSegments = typeof options.heightSegments === 'undefined' ? 1 : options.heightSegments;
  let depthSegments = typeof options.depthSegments === 'undefined' ? 1 : options.depthSegments;
  let wireFrame = typeof options.wireFrame === 'undefined' ? false : options.wireFrame;

  return {
    width: width,
    height: height,
    depth: depth,
    widthSegments: widthSegments,
    heightSegments: heightSegments,
    depthSegments: depthSegments,
    wireFrame: wireFrame
  };
}

function boxMesh(
  options?: {
    width?: number,
    height?: number,
    depth?: number,
    widthSegments?: number,
    wireFrame?: boolean
  }) : AttributeProvider {

  let checkedOptions = checkBoxArgs(options);

  let base = new GeometryAdapter(boxGeometry(checkedOptions), adapterOptions(checkedOptions));

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

export = boxMesh;
