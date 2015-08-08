import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import UniformProvider = require('../core/UniformProvider');
import CylinderOptions = require('../mesh/CylinderOptions');
declare function cylinder(ambients: UniformProvider, options?: CylinderOptions): Primitive<AttribProvider, ShaderProgram, Node>;
export = cylinder;
