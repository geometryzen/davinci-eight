/// <reference path="..//core/Drawable.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
/// <reference path="../materials/Material.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />

/**
 * A design in which a Drawable is factored into a Geometry and a Material.
 * This factoring is not essential but does enable reuse.
 */
interface FactoredDrawable<G extends Geometry, M extends Material> extends Drawable
{
  geometry: G;
  material: M;
  attitude: blade.Euclidean3;
  position: blade.Euclidean3;
}