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
}

export = DrawList;
