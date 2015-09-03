import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import UniformProvider = require('../core/UniformProvider');
interface DrawableVisitor {
    primitive(mesh: AttribProvider, program: ShaderProgram, model: UniformProvider): any;
}
export = DrawableVisitor;
