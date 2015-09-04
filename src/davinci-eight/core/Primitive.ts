import Composite = require('../core/Composite');
import AttribProvider = require('../core/AttribProvider');
import UniformData = require('../core/UniformData');
import ShaderProgram = require('../core/ShaderProgram');

/**
 * A design in which a Drawable is factored into a Geometry and a Material.
 * This factoring is not essential but does enable reuse.
 */
interface Primitive<MESH extends AttribProvider, MODEL extends UniformData> extends Composite<MODEL>
{
  mesh: MESH;
  // Composite provides the model
  // Drawable provides the program.
}

export = Primitive;
