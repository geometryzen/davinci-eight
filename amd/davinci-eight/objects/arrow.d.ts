import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import ModelMatrixUniformProvider = require('../uniforms/ModelMatrixUniformProvider');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
declare function arrow(ambients: UniformProvider, options?: ArrowOptions): DrawableModel<AttributeProvider, ShaderProgram, ModelMatrixUniformProvider>;
export = arrow;
