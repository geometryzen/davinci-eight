import AttribProvider = require('../core/AttribProvider');
import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import cylinderMesh = require('../mesh/cylinderMesh');
import CylinderOptions = require('../mesh/CylinderOptions');
import Cartesian3 = require('../math/Cartesian3');
import Vector3 = require('../math/Vector3');

/**
 * @class CylinderArgs
 */
class CylinderArgs {
  private $radiusTop: number;
  private $radiusBottom: number;
  private $height: number;
  private $axis: Vector3 = Vector3.e3.clone();
  private $depth: number;
  private $widthSegments: number;
  private $heightSegments: number;
  private $depthSegments: number;
  private $wireFrame: boolean;
  constructor(options?: CylinderOptions) {
    options = options || {modelMatrix: 'uModelMatrix'};
    this.setRadiusTop(isUndefined(options.radiusTop) ? 1 : options.radiusTop);
    this.setRadiusBottom(isUndefined(options.radiusBottom) ? 1 : options.radiusBottom);
//    this.setHeight(isUndefined(options.height) ? 1 : options.height);
//    this.setDepth(isUndefined(options.depth) ? 1 : options.depth);
//    this.setWidthSegments(isUndefined(options.widthSegments) ? 1 : options.widthSegments);
//    this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
//    this.setDepthSegments(isUndefined(options.depthSegments) ? 1 : options.depthSegments);
    this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
  }
  get radiusTop(): number {
    return this.$radiusTop;
  }
  get radiusBottom(): number {
    return this.$radiusBottom;
  }
  get height() {
    return this.$height;
  }
  get axis(): Cartesian3 {
    return this.$axis;
  }
  get depth() {
    return this.$depth;
  }
  get widthSegments() {
    return this.$widthSegments;
  }
  get heightSegments() {
    return this.$heightSegments;
  }
  get depthSegments() {
    return this.$depthSegments;
  }
  get wireFrame() {
    return this.$wireFrame;
  }
  setRadiusTop(radiusTop: number): CylinderArgs {
    expectArg('radiusTop', radiusTop).toBeNumber().toSatisfy(radiusTop >= 0, "radiusTop must be greater than or equal to zero.");
    this.$radiusTop = radiusTop;
    return this;
  }
  setRadiusBottom(radiusBottom: number): CylinderArgs {
    expectArg('radiusBottom', radiusBottom).toBeNumber().toSatisfy(radiusBottom >= 0, "radiusBottom must be greater than or equal to zero.");
    this.$radiusBottom = radiusBottom;
    return this;
  }
  setHeight(height: number): CylinderArgs {
    expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
    this.$height = height;
    return this;
  }
  setAxis(axis: Cartesian3): CylinderArgs {
    expectArg('axis', axis).toBeObject();
    this.$axis.copy(axis);
    return this;
  }
  setDepth(depth: number): CylinderArgs {
    expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
    this.$depth = depth;
    return this;
  }
  setWidthSegments(widthSegments: number): CylinderArgs {
    expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
    this.$widthSegments = widthSegments;
    return this;
  }
  setHeightSegments(heightSegments: number): CylinderArgs {
    expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
    this.$heightSegments = heightSegments;
    return this;
  }
  setDepthSegments(depthSegments: number): CylinderArgs {
    expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
    this.$depthSegments = depthSegments;
    return this;
  }
  setWireFrame(wireFrame: boolean) {
    expectArg('wireFrame', wireFrame).toBeBoolean();
    this.$wireFrame = wireFrame;
    return this;
  }
}

export = CylinderArgs;