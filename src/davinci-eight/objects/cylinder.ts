import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import StandardModel = require('../uniforms/StandardModel');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import cylinderMesh = require('../mesh/cylinderMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');

function cylinder(ambients: UniformProvider): DrawableModel<AttributeProvider, ShaderProgram, StandardModel> {
  let mesh = cylinderMesh();
  let model = new StandardModel();
  let shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
  return drawableModel(mesh, shaders, model);
}

export = cylinder;
