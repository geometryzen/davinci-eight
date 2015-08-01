import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import boxMesh = require('../mesh/boxMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');
import BoxOptions = require('../mesh/BoxOptions');

function box(ambients: UniformProvider, options?: BoxOptions): DrawableModel<AttribProvider, ShaderProgram, Node> {
  let mesh = boxMesh(options);
  let model = new Node();
  let shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
  return drawableModel(mesh, shaders, model);
}

export = box;