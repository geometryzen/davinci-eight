import AttribProvider = require('../core/AttribProvider');
import Primitive = require('../core/Primitive');
import ShaderProgram = require('../core/ShaderProgram');
import UniformProvider = require('../core/UniformProvider');
declare var primitive: <MESH extends AttribProvider, MODEL extends UniformProvider>(mesh: MESH, program: ShaderProgram, model: MODEL) => Primitive<MESH, MODEL>;
export = primitive;
