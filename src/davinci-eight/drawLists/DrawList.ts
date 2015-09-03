import Drawable = require('../core/Drawable');
import RenderingContextUser = require('../core/RenderingContextUser');
import UniformDataInfo = require('../core/UniformDataInfo');
import UniformDataInfos = require('../core/UniformDataInfos');

interface DrawList extends RenderingContextUser {
  add(drawable: Drawable): void;
  remove(drawable: Drawable): void;
  traverse(callback: (value: Drawable, index: number, array: Drawable[]) => void): void;
  /**
   * Sets the uniforms provided into all programs.
   */
  setUniforms(values: UniformDataInfos);
  uniform1f(name: string, x: number, picky?: boolean);
  uniform1fv(name: string, value: number[], picky?: boolean);
  uniform2f(name: string, x: number, y: number, picky?: boolean);
  uniform2fv(name: string, value: number[], picky?: boolean);
  uniform3f(name: string, x: number, y: number, z: number, picky?: boolean);
  uniform3fv(name: string, value: number[], picky?: boolean);
  uniform4f(name: string, x: number, y: number, z: number, w: number, picky?: boolean);
  uniform4fv(name: string, value: number[], picky?: boolean);
  uniformMatrix2fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean);
  uniformMatrix3fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean);
  uniformMatrix4fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean);
}

export = DrawList;
