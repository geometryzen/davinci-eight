import ShaderProgram = require('../programs/ShaderProgram');
import DrawableModel = require('../objects/DrawableModel');
import AttribProvider = require('../core/AttribProvider');
import UniformProvider = require('../core/UniformProvider');
declare var drawableModel: <MESH extends AttribProvider, SHADERS extends ShaderProgram, MODEL extends UniformProvider>(mesh: MESH, shaders: SHADERS, model: MODEL) => DrawableModel<MESH, SHADERS, MODEL>;
export = drawableModel;
