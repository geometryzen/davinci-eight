import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import cylinderMesh = require('../mesh/cylinderMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');

function cylinder(ambients: UniformProvider): DrawableModel<AttributeProvider, ShaderProgram, Node> {
  let mesh = cylinderMesh();
  let model = new Node();
  let shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
  return drawableModel(mesh, shaders, model);
}

export = cylinder;
