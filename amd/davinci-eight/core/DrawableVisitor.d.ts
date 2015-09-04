import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import UniformData = require('../core/UniformData');
interface DrawableVisitor {
    primitive(mesh: AttribProvider, program: ShaderProgram, model: UniformData): any;
}
export = DrawableVisitor;
