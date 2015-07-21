import ShaderProgram = require('../programs/ShaderProgram');
import DrawableModel = require('../objects/DrawableModel');
import AttributeProvider = require('../core/AttributeProvider');
import UniformProvider = require('../core/UniformProvider');
declare var drawableModel: <A extends AttributeProvider, S extends ShaderProgram, U extends UniformProvider>(attributes: A, shaderProgram: S, uniforms: U) => DrawableModel<A, S, U>;
export = drawableModel;
