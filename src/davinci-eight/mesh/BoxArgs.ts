import expectArg = require('../checks/expectArg');

class BoxArgs {
  private $width: number = 1;
  private $height: number = 1;
  private $depth: number = 1;
  private $widthSegments: number = 1;
  private $heightSegments: number = 1;
  private $depthSegments: number = 1;
  private $wireFrame: boolean = false;
  constructor() {
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
  setWidth(width: number): BoxArgs {
    expectArg('width', width).toBeNumber().toSatisfy(width >= 0, "width must be greater than or equal to zero.");
    this.$width = width;
    return this;
  }
  setHeight(height: number): BoxArgs {
    expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
    this.$height = height;
    return this;
  }
  setDepth(depth: number): BoxArgs {
    expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
    this.$depth = depth;
    return this;
  }
  setWidthSegments(widthSegments: number): BoxArgs {
    expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
    this.$widthSegments = widthSegments;
    return this;
  }
  setHeightSegments(heightSegments: number): BoxArgs {
    expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
    this.$heightSegments = heightSegments;
    return this;
  }
  setDepthSegments(depthSegments: number): BoxArgs {
    expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
    this.$depthSegments = depthSegments;
    return this;
  }
  setWireFrame(wireFrame: boolean) {
    this.$wireFrame = wireFrame;
    return this;
  }
}

export = BoxArgs;