/// <reference path="..//core/Drawable.d.ts" />
/// <reference path="..//core/RenderingContextUser.d.ts" />
interface World extends RenderingContextUser {
  add(drawable: Drawable): void;
  drawGroups: { [drawGroupName: string]: Drawable[] };
}