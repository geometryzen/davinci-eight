import AttributeMetaInfos = require('../core/AttributeMetaInfos');
import cuboid = require('../mesh/cuboid');
import CuboidMesh = require('../mesh/CuboidMesh');
import AttributeProvider = require('../core/AttributeProvider');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');

/**
 * @class BoxMesh
 */
class BoxMesh implements AttributeProvider {
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
  dynamics() {
    return this.cuboid.dynamics();
  }
  hasElements() {
    return this.cuboid.hasElements();
  }
  getElements() {
    return this.cuboid.getElements();
  }
  getVertexAttributeData(name: string) {
    return this.cuboid.getVertexAttributeData(name);
  }
  getAttributeMetaInfos() {
    return this.cuboid.getAttributeMetaInfos();
  }
  update(attributes: ShaderVariableDecl[]) {
    return this.cuboid.update(attributes);
  }
}

export = BoxMesh;
