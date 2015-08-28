import AttribMetaInfos = require('../core/AttribMetaInfos');
import cuboid = require('../mesh/cuboid');
import CuboidMesh = require('../mesh/CuboidMesh');
import AttribProvider = require('../core/AttribProvider');

/**
 * @class BoxMesh
 */
class BoxMesh implements AttribProvider {
  private cuboid: CuboidMesh;
  /**
   * @class BoxMesh
   * @constructor
   * @param width {number}
   * @param height {number}
   * @param depth {number}
   */
  constructor(
    width: number,
    height: number,
    depth: number,
    widthSegments?: number,
    heightSegments?: number,
    depthSegments?: number) {
      this.cuboid = cuboid();
      this.cuboid.a = this.cuboid.a.scalarMultiply(width);
      this.cuboid.b = this.cuboid.b.scalarMultiply(height);
      this.cuboid.c = this.cuboid.c.scalarMultiply(depth);
      this.cuboid.drawMode = 2;
  }
  draw(context: WebGLRenderingContext) {
    return this.cuboid.draw(context);
  }
  get drawMode(): number {
    return this.cuboid.drawMode;
  }
  set drawMode(value: number) {
    this.cuboid.drawMode = value;
  }
  get dynamic() {
    return this.cuboid.dynamic;
  }
  hasElementArray() {
    return this.cuboid.hasElementArray();
  }
  getElementArray() {
    return this.cuboid.getElementArray();
  }
  getAttribArray(name: string) {
    return this.cuboid.getAttribArray(name);
  }
  getAttribMeta() {
    return this.cuboid.getAttribMeta();
  }
  update() {
    return this.cuboid.update();
  }
}

export = BoxMesh;
