import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import UniformProvider = require('../core/UniformProvider');
declare function vortex(ambients: UniformProvider): Primitive<AttribProvider, ShaderProgram, Node>;
export = vortex;
