import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import primitive = require('../objects/primitive');
import vortexMesh = require('../mesh/vortexMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');

function vortex(ambients: UniformProvider): Primitive<AttribProvider, Node> {
  let mesh = vortexMesh();
  let model = new Node();
  let program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
  return primitive(mesh, program, model);
}

export = vortex;
