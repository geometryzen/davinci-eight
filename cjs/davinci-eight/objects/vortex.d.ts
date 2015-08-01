import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
declare function vortex(ambients: UniformProvider): DrawableModel<AttribProvider, ShaderProgram, Node>;
export = vortex;
