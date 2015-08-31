import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import Node = require('../uniforms/Node');
import Primitive = require('../core/Primitive');
import primitive = require('../objects/primitive');
import cylinderMesh = require('../mesh/cylinderMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');
import CylinderOptions = require('../mesh/CylinderOptions');

function cylinder(ambients: UniformProvider, options?: CylinderOptions): Primitive<AttribProvider, Node> {
  let mesh = cylinderMesh(options);
  let model = new Node();
  let program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
  return primitive(mesh, program, model);
}

export = cylinder;
