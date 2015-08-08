import Node = require('../uniforms/Node');
import Blade = require('../objects/Blade');
import UniformProvider = require('../core/UniformProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
declare function arrow(ambients: UniformProvider, options?: ArrowOptions): Blade<Node>;
export = arrow;
