import Drawable = require('../core/Drawable');
import ContextListener = require('../core/ContextListener');
import UniformDataVisitor = require('../core/UniformDataVisitor');

interface DrawList extends ContextListener, UniformDataVisitor {
  add(drawable: Drawable): void;
  remove(drawable: Drawable): void;
  traverse(callback: (value: Drawable) => void): void;
}

export = DrawList;
