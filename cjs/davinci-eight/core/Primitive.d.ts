import Composite = require('../core/Composite');
import AttribProvider = require('../core/AttribProvider');
import UniformProvider = require('../core/UniformProvider');
/**
 * A design in which a Drawable is factored into a Geometry and a Material.
 * This factoring is not essential but does enable reuse.
 */
interface Primitive<MESH extends AttribProvider, MODEL extends UniformProvider> extends Composite<MODEL> {
    mesh: MESH;
}
export = Primitive;
