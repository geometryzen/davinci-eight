import AttribProvider = require('../core/AttribProvider');
import Primitive = require('../core/Primitive');
import ShaderProgram = require('../core/ShaderProgram');
import UniformData = require('../core/UniformData');
declare var primitive: <MESH extends AttribProvider, MODEL extends UniformData>(mesh: MESH, program: ShaderProgram, model: MODEL) => Primitive<MESH, MODEL>;
export = primitive;
