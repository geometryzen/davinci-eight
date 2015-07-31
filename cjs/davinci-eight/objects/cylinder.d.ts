import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import LocalModel = require('../uniforms/LocalModel');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
declare function cylinder(ambients: UniformProvider): DrawableModel<AttributeProvider, ShaderProgram, LocalModel>;
export = cylinder;
