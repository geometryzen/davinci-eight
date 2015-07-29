import AttributeProvider = require('../core/AttributeProvider');
import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import boxMesh = require('../mesh/boxMesh');
import BoxOptions = require('../mesh/BoxOptions');

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
  constructor(options?: BoxOptions) {
    options = options || {};
    this.setWidth(isUndefined(options.width) ? 1 : options.width);
    this.setHeight(isUndefined(options.height) ? 1 : options.height);
    this.setDepth(isUndefined(options.depth) ? 1 : options.depth);
    this.setWidthSegments(isUndefined(options.widthSegments) ? 1 : options.widthSegments);
    this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
    this.setDepthSegments(isUndefined(options.depthSegments) ? 1 : options.depthSegments);
    this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
  }
  get width() {
    return this.$width;
  }
  get height() {
    return this.$height;
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
  buildMesh(): AttributeProvider {
    return boxMesh(this);
  }
}

export = BoxBuilder;