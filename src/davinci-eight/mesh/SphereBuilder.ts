import AttribProvider = require('../core/AttribProvider');
import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import sphereMesh = require('../mesh/sphereMesh');
import SphereOptions = require('../mesh/SphereOptions');

class SphereBuilder {
  private $radius: number;
  private $phiStart: number;
  private $phiLength: number;
  private $thetaStart: number;
  private $thetaLength: number ;
  private $widthSegments: number;
  private $heightSegments: number;
  private $wireFrame: boolean;
  constructor(options?: SphereOptions) {
    options = options || {};
    this.setRadius(isUndefined(options.radius) ? 1 : options.radius);
    this.setPhiStart(isUndefined(options.phiStart) ? 0 : options.phiStart);
    this.setPhiLength(isUndefined(options.phiLength) ? 2 * Math.PI : options.phiLength);
    this.setThetaStart(isUndefined(options.thetaStart) ? 0 : options.thetaStart);
    this.setThetaLength(isUndefined(options.thetaLength) ? Math.PI : options.thetaLength);
    this.setWidthSegments(isUndefined(options.widthSegments) ? 16 : options.widthSegments);
    this.setHeightSegments(isUndefined(options.heightSegments) ? 12 : options.heightSegments);
    this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
  }
  get radius() {
    return this.$radius;
  }
  get phiStart() {
    return this.$phiStart;
  }
  get phiLength() {
    return this.$phiLength;
  }
  get thetaStart() {
    return this.$thetaStart;
  }
  get thetaLength() {
    return this.$thetaLength;
  }
  get widthSegments() {
    return this.$widthSegments;
  }
  get heightSegments() {
    return this.$heightSegments;
  }
  get wireFrame() {
    return this.$wireFrame;
  }
  setRadius(radius: number): SphereBuilder {
    expectArg('radius', radius).toBeNumber().toSatisfy(radius >= 0, "radius must be greater than or equal to zero.");
    this.$radius = radius;
    return this;
  }
  setPhiStart(phiStart: number): SphereBuilder {
    expectArg('phiStart', phiStart).toBeNumber();
    this.$phiStart = phiStart;
    return this;
  }
  setPhiLength(phiLength: number): SphereBuilder {
    expectArg('phiLength', phiLength).toBeNumber();
    this.$phiLength = phiLength;
    return this;
  }
  setThetaStart(thetaStart: number): SphereBuilder {
    expectArg('thetaStart', thetaStart).toBeNumber();
    this.$thetaStart = thetaStart;
    return this;
  }
  setThetaLength(thetaLength: number): SphereBuilder {
    expectArg('thetaLength', thetaLength).toBeNumber();
    this.$thetaLength = thetaLength;
    return this;
  }
  setWidthSegments(widthSegments: number): SphereBuilder {
    expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
    this.$widthSegments = widthSegments;
    return this;
  }
  setHeightSegments(heightSegments: number): SphereBuilder {
    expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
    this.$heightSegments = heightSegments;
    return this;
  }
  setWireFrame(wireFrame: boolean) {
    expectArg('wireFrame', wireFrame).toBeBoolean();
    this.$wireFrame = wireFrame;
    return this;
  }
  buildMesh(): AttribProvider {
    return sphereMesh(this);
  }
}

export = SphereBuilder;