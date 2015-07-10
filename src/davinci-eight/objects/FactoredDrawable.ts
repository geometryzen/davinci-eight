/// <reference path="..//core/Drawable.d.ts" />
/// <reference path="../materials/Material.d.ts" />
import Vector3 = require('../math/Vector3');
import Spinor3 = require('../math/Spinor3');
/**
 * A design in which a Drawable is factored into a Geometry and a Material.
 * This factoring is not essential but does enable reuse.
 */
interface FactoredDrawable<G, M extends Material> extends Drawable
{
  geometry: G;
  material: M;
  attitude: Spinor3;
  position: Vector3;
}

export = FactoredDrawable;
