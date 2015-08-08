import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import UniformProvider = require('../core/UniformProvider');
import BoxOptions = require('../mesh/BoxOptions');
declare function box(ambients: UniformProvider, options?: BoxOptions): Primitive<AttribProvider, ShaderProgram, Node>;
export = box;
