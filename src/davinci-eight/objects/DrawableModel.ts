import Drawable = require('../core/Drawable');
import AttribProvider = require('../core/AttribProvider');
import UniformProvider = require('../core/UniformProvider');
import ShaderProgram = require('../programs/ShaderProgram');

/**
 * A design in which a Drawable is factored into a Geometry and a Material.
 * This factoring is not essential but does enable reuse.
 */
interface DrawableModel<MESH extends AttribProvider, SHADERS extends ShaderProgram, MODEL extends UniformProvider> extends Drawable
{
  mesh: MESH;
  shaders: SHADERS;
  model: MODEL;
}

export = DrawableModel;
