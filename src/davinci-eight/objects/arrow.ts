import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import arrowMesh = require('../mesh/arrowMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');
import ArrowOptions = require('../mesh/ArrowOptions');

function arrow(ambients: UniformProvider, options?: ArrowOptions): DrawableModel<AttribProvider, ShaderProgram, Node> {
  let mesh = arrowMesh(options);
  let model = new Node(options);
  let shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
  return drawableModel(mesh, shaders, model);
}

export = arrow;