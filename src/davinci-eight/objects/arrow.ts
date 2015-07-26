import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import ModelMatrixUniformProvider = require('../uniforms/ModelMatrixUniformProvider');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import arrowMesh = require('../mesh/arrowMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');

function arrow(ambients: UniformProvider): DrawableModel<AttributeProvider, ShaderProgram, ModelMatrixUniformProvider> {
  let mesh = arrowMesh();
  let model = new ModelMatrixUniformProvider();
  let shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
  return drawableModel(mesh, shaders, model);
}

export = arrow;