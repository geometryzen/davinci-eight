/// <reference path='../renderers/VertexUniformProvider.d.ts'/>
/// <reference path='../materials/UniformMetaInfo.d.ts'/>
/// <reference path='../core/Drawable.d.ts'/>
import Matrix4 = require('../math/Matrix4');

declare var glMatrix: glMatrix;
let UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
let UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';

// Camera implements Drawable purely so that we can add it to the Scene.
// However, since we don't actually draw it, it's not an issue.
// Maybe one day there will be multiple cameras and we might make them visible?
class Camera implements VertexUniformProvider, Drawable {
  public projectionMatrix: Matrix4 = new Matrix4();
  private fakeHasContext = false;
  constructor(spec?) {
  }
  getUniformMatrix3(name: string) {
    return null;
  }
  getUniformMatrix4(name: string) {
    switch(name) {
      case UNIFORM_PROJECTION_MATRIX_NAME: {
        var value: Float32Array = new Float32Array(this.projectionMatrix.elements);
        return {transpose: false, matrix4: value};
      }
      default: {
        return null;
      }
    }
  }
  get drawGroupName() {
    // Anything will do here as long as nothing else uses the same group name; the Camera won't be drawn.
    return "Camera";
  }
  useProgram(context: WebGLRenderingContext) {
    // Thanks, but I'm not going to be drawn so I don't need a program.
  }
  draw(context: WebGLRenderingContext, time: number, uniformProvider: VertexUniformProvider) {
    // Do nothing.
  }
  contextFree(context: WebGLRenderingContext) {
    this.fakeHasContext = false;
  }
  contextGain(context: WebGLRenderingContext, contextId: string) {
    this.fakeHasContext = true;
  }
  contextLoss() {
    this.fakeHasContext = false;
  }
  hasContext() {
    return this.fakeHasContext;
  }
  static getUniformMetaInfo(): UniformMetaInfo {
    return {projectionMatrix:{name: UNIFORM_PROJECTION_MATRIX_NAME, type: UNIFORM_PROJECTION_MATRIX_TYPE}};
  }
}

export = Camera;