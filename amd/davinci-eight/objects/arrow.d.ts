import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
declare function arrow(ambients: UniformProvider, options?: ArrowOptions): DrawableModel<AttribProvider, ShaderProgram, Node>;
export = arrow;
