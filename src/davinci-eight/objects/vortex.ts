import AttributeProvider = require('../core/AttributeProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import vortexMesh = require('../mesh/vortexMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');

function vortex(ambients: UniformProvider): DrawableModel<AttributeProvider, ShaderProgram, Node> {
  let mesh = vortexMesh();
  let model = new Node();
  let shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
  return drawableModel(mesh, shaders, model);
}

export = vortex;
