import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../programs/ShaderProgram');
import Node = require('../uniforms/Node');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import sphereMesh = require('../mesh/sphereMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');
import SphereOptions = require('../mesh/SphereOptions');

function sphere(ambients: UniformProvider, options?: SphereOptions): DrawableModel<AttribProvider, ShaderProgram, Node> {
  let mesh = sphereMesh(options);
  let model = new Node();
  let shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
  return drawableModel(mesh, shaders, model);
}

export = sphere;
