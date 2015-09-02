import AttribProvider = require('../core/AttribProvider');
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
    },
    addRef(): void {
      refCount++;
    },
    release(): void {
      refCount--;
      if (refCount === 0) {
        base.release();
      }
    },
    contextGain(context: WebGLRenderingContext): void {
      return base.contextGain(context);
    },
    contextLoss(): void {
      return base.contextLoss();
    },
    hasContext(): boolean {
      return base.hasContext();
    }
  };
  return publicAPI;
}

export = cylinderMesh;
