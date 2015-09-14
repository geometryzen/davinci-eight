import AttribProvider = require('../core/AttribProvider');
import Program = require('../core/Program');
import UniformData = require('../core/UniformData');
interface DrawableVisitor {
    primitive(mesh: AttribProvider, program: Program, model: UniformData): any;
}
export = DrawableVisitor;
