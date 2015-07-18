import Drawable = require('../core/Drawable');
import RenderingContextUser = require('../core/RenderingContextUser');

interface World extends RenderingContextUser {
  add(drawable: Drawable): void;
  drawGroups: { [drawGroupName: string]: Drawable[] };
}

export = World;
