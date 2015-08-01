import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import vortexMesh = require('../mesh/vortexMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');

function vortex(ambients: UniformProvider): DrawableModel<AttribProvider, ShaderProgram, Node> {
  let mesh = vortexMesh();
  let model = new Node();
  let shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
  return drawableModel(mesh, shaders, model);
}

export = vortex;
