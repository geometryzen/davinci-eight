import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import primitive = require('../objects/primitive');
import sphereMesh = require('../mesh/sphereMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');
import SphereOptions = require('../mesh/SphereOptions');

function sphere(ambients: UniformProvider, options?: SphereOptions): Primitive<AttribProvider, Node> {
  let mesh = sphereMesh(options);
  let model = new Node();
  // TODO: Inject a program manager.
  // Would be nice to have dependency injection?
  let program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
  return primitive(mesh, program, model);
}

export = sphere;
