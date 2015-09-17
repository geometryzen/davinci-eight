import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import CylinderOptions = require('../mesh/CylinderOptions');
import Cartesian3 = require('../math/Cartesian3');
import Vector3 = require('../math/Vector3');
import Symbolic = require('../core/Symbolic');

/**
 * @class CylinderArgs
 */
class CylinderArgs {
  private $radiusTop: number;
  private $radiusBottom: number;
  private $height: number;
  private $radialSegments: number;
  private $heightSegments: number;
  private $openEnded: boolean
  private $thetaStart: number;
  private $thetaLength: number;
  private $wireFrame: boolean;
  private $axis: Vector3 = Vector3.e3.clone();
  constructor(options?: CylinderOptions) {
    options = options || {modelMatrix: Symbolic.UNIFORM_MODEL_MATRIX};
    this.setRadiusTop(isUndefined(options.radiusTop) ? 1 : options.radiusTop);
    this.setRadiusBottom(isUndefined(options.radiusBottom) ? 1 : options.radiusBottom);
    this.setHeight(isUndefined(options.height) ? 1 : options.height);
    this.setRadialSegments(isUndefined(options.radialSegments) ? 16 : options.radialSegments);
    this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
    this.setOpenEnded(isUndefined(options.openEnded) ? false : options.openEnded);
    this.setThetaStart(isUndefined(options.thetaStart) ? 0 : options.thetaStart);
    this.setThetaLength(isUndefined(options.thetaLength) ? 2 * Math.PI : options.thetaLength);
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
  get radialSegments() {
    return this.$radialSegments;
  }
  get heightSegments() {
    return this.$heightSegments;
  }
  get openEnded() {
    return this.$openEnded;
  }
  get thetaStart() {
    return this.$thetaStart;
  }
  get thetaLength() {
    return this.$thetaLength;
  }
  get wireFrame() {
    return this.$wireFrame;
  }
  get axis(): Cartesian3 {
    return this.$axis;
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
  setRadialSegments(radialSegments: number): CylinderArgs {
    expectArg('radialSegments', radialSegments).toBeNumber();
    this.$radialSegments = radialSegments;
    return this;
  }
  setHeightSegments(heightSegments: number): CylinderArgs {
    expectArg('heightSegments', heightSegments).toBeNumber();
    this.$heightSegments = heightSegments;
    return this;
  }
  setOpenEnded(openEnded: boolean) {
    expectArg('openEnded', openEnded).toBeBoolean();
    this.$openEnded = openEnded;
    return this;
  }
  setThetaStart(thetaStart: number): CylinderArgs {
    expectArg('thetaStart', thetaStart).toBeNumber();
    this.$thetaStart = thetaStart;
    return this;
  }
  setThetaLength(thetaLength: number): CylinderArgs {
    expectArg('thetaLength', thetaLength).toBeNumber();
    this.$thetaLength = thetaLength;
    return this;
  }
  setWireFrame(wireFrame: boolean) {
    expectArg('wireFrame', wireFrame).toBeBoolean();
    this.$wireFrame = wireFrame;
    return this;
  }
  setAxis(axis: Cartesian3): CylinderArgs {
    expectArg('axis', axis).toBeObject();
    this.$axis.copy(axis);
    return this;
  }
}

export = CylinderArgs;
