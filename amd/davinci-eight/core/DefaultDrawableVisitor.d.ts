import AttribProvider = require('../core/AttribProvider');
import DrawableVisitor = require('../core/DrawableVisitor');
import ShaderProgram = require('../core/ShaderProgram');
import UniformProvider = require('../core/UniformProvider');
declare class DefaultDrawableVisitor implements DrawableVisitor {
    constructor();
    primitive(mesh: AttribProvider, program: ShaderProgram, model: UniformProvider): void;
}
export = DefaultDrawableVisitor;
