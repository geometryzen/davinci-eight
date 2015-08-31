import AttribProvider = require('../core/AttribProvider');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import UniformProvider = require('../core/UniformProvider');
declare function vortex(ambients: UniformProvider): Primitive<AttribProvider, Node>;
export = vortex;
