import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import StandardModel = require('../uniforms/StandardModel');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import boxMesh = require('../mesh/boxMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');
import BoxOptions = require('../mesh/BoxOptions');

function box(ambients: UniformProvider, options?: BoxOptions): DrawableModel<AttributeProvider, ShaderProgram, StandardModel> {
  let mesh = boxMesh(options);
  let model = new StandardModel();
  let shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
  return drawableModel(mesh, shaders, model);
}

export = box;