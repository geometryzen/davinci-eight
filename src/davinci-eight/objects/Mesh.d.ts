/// <reference path="..//core/Drawable.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
/// <reference path="../materials/Material.d.ts" />

/**
 * A mesh is simply one implementation of a Drawable.
 */
interface Mesh<G extends Geometry, M extends Material> extends Drawable
{
  geometry: G;
  material: M;
}