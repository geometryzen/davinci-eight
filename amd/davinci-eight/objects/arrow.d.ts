import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
declare function arrow(ambients: UniformProvider, options?: ArrowOptions): DrawableModel<AttributeProvider, ShaderProgram, Node>;
export = arrow;
