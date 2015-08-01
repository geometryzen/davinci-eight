import AttribProvider = require('../core/AttribProvider');
import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import arrowMesh = require('../mesh/arrowMesh');
import ArrowOptions = require('../mesh/ArrowOptions');
import Cartesian3 = require('../math/Cartesian3');
import Vector3 = require('../math/Vector3');

/**
 * @class ArrowBuilder
 */
class ArrowBuilder {
  private $axis: Vector3 = Vector3.e3.clone();
  private $height: number;
  private $depth: number;
  private $widthSegments: number;
  private $heightSegments: number;
  private $depthSegments: number;
  private $wireFrame: boolean;
  constructor(options?: ArrowOptions) {
    options = options || {modelMatrix: 'uModelMatrix'};
//    this.setWidth(isUndefined(options.width) ? 1 : options.width);
//    this.setHeight(isUndefined(options.height) ? 1 : options.height);
//    this.setDepth(isUndefined(options.depth) ? 1 : options.depth);
//    this.setWidthSegments(isUndefined(options.widthSegments) ? 1 : options.widthSegments);
//    this.setHeightSegments(isUndefined(options.heightSegments) ? 1 : options.heightSegments);
//    this.setDepthSegments(isUndefined(options.depthSegments) ? 1 : options.depthSegments);
    this.setWireFrame(isUndefined(options.wireFrame) ? false : options.wireFrame);
  }
  get axis(): Cartesian3 {
    return this.$axis;
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
  setAxis(axis: Cartesian3): ArrowBuilder {
    expectArg('axis', axis).toBeObject();
    this.$axis.copy(axis);
    return this;
  }
  setHeight(height: number): ArrowBuilder {
    expectArg('height', height).toBeNumber().toSatisfy(height >= 0, "height must be greater than or equal to zero.");
    this.$height = height;
    return this;
  }
  setDepth(depth: number): ArrowBuilder {
    expectArg('depth', depth).toBeNumber().toSatisfy(depth >= 0, "depth must be greater than or equal to zero.");
    this.$depth = depth;
    return this;
  }
  setWidthSegments(widthSegments: number): ArrowBuilder {
    expectArg('widthSegments', widthSegments).toBeNumber().toSatisfy(widthSegments > 0, "widthSegments must be greater than zero.");
    this.$widthSegments = widthSegments;
    return this;
  }
  setHeightSegments(heightSegments: number): ArrowBuilder {
    expectArg('heightSegments', heightSegments).toBeNumber().toSatisfy(heightSegments > 0, "heightSegments must be greater than zero.");
    this.$heightSegments = heightSegments;
    return this;
  }
  setDepthSegments(depthSegments: number): ArrowBuilder {
    expectArg('depthSegments', depthSegments).toBeNumber().toSatisfy(depthSegments > 0, "depthSegments must be greater than zero.");
    this.$depthSegments = depthSegments;
    return this;
  }
  setWireFrame(wireFrame: boolean) {
    expectArg('wireFrame', wireFrame).toBeBoolean();
    this.$wireFrame = wireFrame;
    return this;
  }
  buildMesh(): AttribProvider {
    return arrowMesh(this);
  }
}

export = ArrowBuilder;