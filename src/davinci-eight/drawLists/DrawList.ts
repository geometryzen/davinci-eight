import Drawable = require('../core/Drawable');
import RenderingContextUser = require('../core/RenderingContextUser');
import UniformDataVisitor = require('../core/UniformDataVisitor');

interface DrawList extends RenderingContextUser, UniformDataVisitor {
  add(drawable: Drawable): void;
  remove(drawable: Drawable): void;
  traverse(callback: (value: Drawable) => void): void;
}

export = DrawList;
