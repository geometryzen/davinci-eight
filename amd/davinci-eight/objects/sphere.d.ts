import AttribProvider = require('../core/AttribProvider');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import UniformProvider = require('../core/UniformProvider');
import SphereOptions = require('../mesh/SphereOptions');
declare function sphere(ambients: UniformProvider, options?: SphereOptions): Primitive<AttribProvider, Node>;
export = sphere;
