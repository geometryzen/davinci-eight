import AttribProvider = require('../core/AttribProvider');
import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import boxMesh = require('../mesh/boxMesh');
import BoxOptions = require('../mesh/BoxOptions');
import Symbolic = require('../core/Symbolic');

/**
 * @class BoxBuilder
 */
class BoxBuilder {
  private $width: number;
  private $height: number;
  private $depth: number;
  private $widthSegments: number;
  private $heightSegments: number;
  private $depthSegments: number;
  private $wireFrame: boolean;
  private $positionVarName: string;
  private $normalVarName: string;
  constructor(options?: BoxOptions) {
    options = options || {};
    this.setWidth(isUndefined(options.width) ? 1 : options.width);
    this.setHeight(isUndefined(options.height) ? 1 : options.height);
    this.setDepth(isUndefined(options.depth) ? 1 : options.depth);
    this.setWidthSegments(isUndefined(options.widthSegments) ? 1 : options.widthSegments);
    this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
    this.setDepthSegments(isUndefined(options.depthSegments) ? 1 : options.depthSegments);
    this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
    this.setPositionVarName(isUndefined(options.positionVarName) ? Symbolic.ATTRIBUTE_POSITION : options.positionVarName);
    this.setNormalVarName(isUndefined(options.normalVarName) ? Symbolic.ATTRIBUTE_NORMAL : options.normalVarName);
  }
  get width(): number {
    return this.$width;
  }
  get height(): number {
    return this.$height;
  }
  get depth(): number {
    return this.$depth;
  }
  get widthSegments(): number {
    return this.$widthSegments;
  }
  get heightSegments(): number {
    return this.$heightSegments;
  }
  get depthSegments(): number {
    return this.$depthSegments;
  }
  get wireFrame(): boolean {
    return this.$wireFrame;
  }
  get positionVarName(): string {
    return this.$positionVarName;
  }
  get normalVarName(): string {
    return this.$normalVarName;
  }
  setWidth(width: number): BoxBuilder {
    expectArg('width', width).toBeNumber().toSatisfy(width >= 0, "width must be greater than or equal to zero.");
    this.$width = width;
    return this;
  }
  setHeight(height: number): BoxBuilder {
    expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
    this.$height = height;
    return this;
  }
  setDepth(depth: number): BoxBuilder {
    expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
    this.$depth = depth;
    return this;
  }
  setWidthSegments(widthSegments: number): BoxBuilder {
    expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
    this.$widthSegments = widthSegments;
    return this;
  }
  setHeightSegments(heightSegments: number): BoxBuilder {
    expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
    this.$heightSegments = heightSegments;
    return this;
  }
  setDepthSegments(depthSegments: number): BoxBuilder {
    expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
    this.$depthSegments = depthSegments;
    return this;
  }
  setWireFrame(wireFrame: boolean) {
    expectArg('wireFrame', wireFrame).toBeBoolean();
    this.$wireFrame = wireFrame;
    return this;
  }
  setPositionVarName(positionVarName: string) {
    expectArg('positionVarName', positionVarName).toBeString();
    this.$positionVarName = positionVarName;
    return this;
  }
  setNormalVarName(normalVarName: string) {
    expectArg('normalVarName', normalVarName).toBeString();
    this.$normalVarName = normalVarName;
    return this;
  }
  buildMesh(): AttribProvider {
    return boxMesh(this);
  }
}

export = BoxBuilder;