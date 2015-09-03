import AttribProvider = require('../core/AttribProvider');
import DrawableVisitor = require('../core/DrawableVisitor');
import ShaderProgram = require('../core/ShaderProgram');
import UniformProvider = require('../core/UniformProvider');

class DefaultDrawableVisitor implements DrawableVisitor {
  constructor() {
  }
  primitive(mesh: AttribProvider, program: ShaderProgram, model: UniformProvider) {
    if (mesh.dynamic) {
      mesh.update();
    }

    program.use();

    // TODO: What is the overhead?
    program.setUniforms(model.getUniformData());
    program.setAttributes(mesh.getAttribData());

    mesh.draw();

    for (var name in program.attributeLocations) {
      program.attributeLocations[name].disable();
    }
  }
}

export = DefaultDrawableVisitor;