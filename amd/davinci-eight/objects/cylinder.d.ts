import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import StandardModel = require('../uniforms/StandardModel');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
declare function cylinder(ambients: UniformProvider): DrawableModel<AttributeProvider, ShaderProgram, StandardModel>;
export = cylinder;
