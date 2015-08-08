import ShaderProgram = require('../core/ShaderProgram');
import Primitive = require('../core/Primitive');
import AttribProvider = require('../core/AttribProvider');
import UniformProvider = require('../core/UniformProvider');
declare var primitive: <MESH extends AttribProvider, SHADERS extends ShaderProgram, MODEL extends UniformProvider>(mesh: MESH, shaders: SHADERS, model: MODEL) => Primitive<MESH, SHADERS, MODEL>;
export = primitive;
