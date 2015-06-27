/// <reference path="..//core/Drawable.d.ts" />
/// <reference path="..//core/RenderingContextUser.d.ts" />
interface Scene extends RenderingContextUser {
  /**
   *
   */
  add(drawable: Drawable): void;
  /**
   *
   */
  drawGroups: { [drawGroupName: string]: Drawable[] };
}