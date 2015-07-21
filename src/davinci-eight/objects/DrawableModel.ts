import Drawable = require('../core/Drawable');
import AttributeProvider = require('../core/AttributeProvider');
import UniformProvider = require('../core/UniformProvider');
import ShaderProgram = require('../programs/ShaderProgram');

/**
 * A design in which a Drawable is factored into a Geometry and a Material.
 * This factoring is not essential but does enable reuse.
 */
interface DrawableModel<A extends AttributeProvider, S extends ShaderProgram, U extends UniformProvider> extends Drawable
{
  attributes: A;
  shaders: S;
  uniforms: U;
}

export = DrawableModel;
