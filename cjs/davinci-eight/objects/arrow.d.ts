import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import StandardModel = require('../uniforms/StandardModel');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
declare function arrow(ambients: UniformProvider, options?: ArrowOptions): DrawableModel<AttributeProvider, ShaderProgram, StandardModel>;
export = arrow;
