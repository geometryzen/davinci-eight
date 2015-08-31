import AttribProvider = require('../core/AttribProvider');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import UniformProvider = require('../core/UniformProvider');
import BoxOptions = require('../mesh/BoxOptions');
declare function box(ambients: UniformProvider, options?: BoxOptions): Primitive<AttribProvider, Node>;
export = box;
