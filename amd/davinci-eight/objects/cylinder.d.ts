import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import ModelMatrixUniformProvider = require('../uniforms/ModelMatrixUniformProvider');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
declare function cylinder(ambients: UniformProvider): DrawableModel<AttributeProvider, ShaderProgram, ModelMatrixUniformProvider>;
export = cylinder;
