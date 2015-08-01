import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
import SphereOptions = require('../mesh/SphereOptions');
declare function sphere(ambients: UniformProvider, options?: SphereOptions): DrawableModel<AttribProvider, ShaderProgram, Node>;
export = sphere;
