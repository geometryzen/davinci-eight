import ShaderProgram = require('../programs/ShaderProgram');
import DrawableModel = require('../objects/DrawableModel');
import VertexAttributeProvider = require('../core/VertexAttributeProvider');
import VertexUniformProvider = require('../core/VertexUniformProvider');
declare var drawableModel: <G extends VertexAttributeProvider, M extends VertexUniformProvider, P extends ShaderProgram>(mesh: G, model: M, shaderProgram: P) => DrawableModel<G, M, P>;
export = drawableModel;
