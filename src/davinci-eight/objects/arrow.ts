import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import Node = require('../uniforms/Node');
import Blade = require('../objects/Blade');
import Primitive = require('../core/Primitive');
import primitive = require('../objects/primitive');
import arrowMesh = require('../mesh/arrowMesh');
import smartProgram = require('../programs/smartProgram');
import UniformProvider = require('../core/UniformProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
import Arrow3D = require('../objects/Arrow3D');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');

class ArrowWrapper implements Blade<Node> {
  private primitive: Primitive<AttribProvider, Node>
  constructor(primitive: Primitive<AttribProvider, Node>) {
    this.primitive = primitive;
  }
  get model(): Node {
    return this.primitive.model;
  }
  setMagnitude(magnitude: number): Blade<Node> {
    expectArg('magnitude', magnitude).toBeNumber().toSatisfy(magnitude >= 0, "magnitude must be positive")
    this.primitive.model.scale.x = magnitude;
    this.primitive.model.scale.y = magnitude;
    this.primitive.model.scale.z = magnitude;
    return this;
  }
  get program(): ShaderProgram {
    return this.primitive.program;
  }
  draw(): void {
    return this.primitive.draw();
  }
  contextFree(): void {
    return this.primitive.contextFree();
  }
  contextGain(context: WebGLRenderingContext, contextId: string): void {
    return this.primitive.contextGain(context, contextId);
  }
  contextLoss(): void {
    return this.primitive.contextLoss();
  }
  hasContext(): boolean {
    return this.primitive.hasContext();
  }
}

// TODO" Should only take the UniformMetaInfos for construction.
function arrow(ambients: UniformProvider, options?: ArrowOptions): Blade<Node> {
  options = options || {};
  let flavor = isDefined(options.flavor) ? options.flavor : 0;
  if (flavor === 0) {
    let mesh = arrowMesh(options);
    let model = new Node(options);
    let shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
    return new ArrowWrapper(primitive(mesh, shaders, model));
  }
  else {
    return new Arrow3D(ambients, options);
  }
}

export = arrow;