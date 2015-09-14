import AttribProvider = require('../core/AttribProvider');
import Primitive = require('../core/Primitive');
import Program = require('../core/Program');
import UniformData = require('../core/UniformData');
declare var primitive: <MESH extends AttribProvider, MODEL extends UniformData>(mesh: MESH, program: Program, model: MODEL) => Primitive<MESH, MODEL>;
export = primitive;
