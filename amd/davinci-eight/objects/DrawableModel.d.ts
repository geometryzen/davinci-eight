import Drawable = require('../core/Drawable');
import VertexUniformProvider = require('../core/VertexUniformProvider');
import ShaderProgram = require('../programs/ShaderProgram');
/**
 * A design in which a Drawable is factored into a Geometry and a Material.
 * This factoring is not essential but does enable reuse.
 */
interface DrawableModel<G, M extends VertexUniformProvider, P extends ShaderProgram> extends Drawable {
    mesh: G;
    model: M;
    shaderProgram: P;
}
export = DrawableModel;
