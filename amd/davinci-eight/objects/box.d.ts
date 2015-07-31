import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import StandardModel = require('../uniforms/StandardModel');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
import BoxOptions = require('../mesh/BoxOptions');
declare function box(ambients: UniformProvider, options?: BoxOptions): DrawableModel<AttributeProvider, ShaderProgram, StandardModel>;
export = box;
