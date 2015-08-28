import AttribMetaInfos = require('../core/AttribMetaInfos');
import IdentityAttribProvider = require('../core/IdentityAttribProvider');
import DataUsage = require('../core/DataUsage');
import DrawMode = require('../core/DrawMode');
import Symbolic = require('../core/Symbolic');

class DefaultAttribProvider extends IdentityAttribProvider {
  constructor() {
    super();
  }
  draw(context: WebGLRenderingContext): void {
    /*
    switch(this.drawMode) {
      case DrawMode.POINTS: {
        context.drawArrays(context.POINTS, 0, this.points.length * 1);
      }
      break;
      case DrawMode.LINES: {
        context.drawArrays(context.LINES, 0, this.lines.length * 2);
      }
      break;
      case DrawMode.TRIANGLES: {
        //context.drawElements(context.TRIANGLES, this.elementArray.length, context.UNSIGNED_SHORT,0);
        context.drawArrays(context.TRIANGLES, 0, this.geometry.faces.length * 3);
      }
      break;
      default : {
      }
    }
    */
  }
  update(): void {
    return super.update();
  }
  getAttribArray(name: string): {usage: DataUsage; data: Float32Array} {
    return super.getAttribArray(name);
  }
  getAttribMeta(): AttribMetaInfos {
    var attributes: AttribMetaInfos = super.getAttribMeta();
    attributes[Symbolic.ATTRIBUTE_POSITION] = {glslType: 'vec3', size: 3};
    return attributes;
  }
  hasElementArray(): boolean {
    return super.hasElementArray();
  }
  getElementArray(): {usage: DataUsage; data: Uint16Array} {
    return super.getElementArray();
  }
}

export = DefaultAttribProvider;