import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
declare function vortex(ambients: UniformProvider): DrawableModel<AttributeProvider, ShaderProgram, Node>;
export = vortex;
