import AttribProvider = require('../core/AttribProvider');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import UniformProvider = require('../core/UniformProvider');
import CylinderOptions = require('../mesh/CylinderOptions');
declare function cylinder(ambients: UniformProvider, options?: CylinderOptions): Primitive<AttribProvider, Node>;
export = cylinder;
