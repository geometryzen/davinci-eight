import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import StandardModel = require('../uniforms/StandardModel');
import DrawableModel = require('../objects/DrawableModel');
import UniformProvider = require('../core/UniformProvider');
import SphereOptions = require('../mesh/SphereOptions');
declare function sphere(ambients: UniformProvider, options?: SphereOptions): DrawableModel<AttributeProvider, ShaderProgram, StandardModel>;
export = sphere;
