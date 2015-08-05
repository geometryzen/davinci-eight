import AttribProvider = require('../core/AttribProvider');
import Color = require('../core/Color');
import CylinderBuilder = require('../mesh/CylinderBuilder');
import Drawable = require('../core/Drawable');
import DrawableModel = require('../objects/DrawableModel');
import drawableModel = require('../objects/drawableModel');
import ShaderProgram = require('../programs/ShaderProgram');
import smartProgram = require('../programs/smartProgram')
import Spinor3 = require('../math/Spinor3');
import Node = require('../uniforms/Node');
import UniformProvider = require('../core/UniformProvider');
import Vector3 = require('../math/Vector3');

class Arrow implements Drawable {
  public drawGroupName: string;
  private $length: number = 1;
  private model: Node;
  private headModel: Node;
  private tailModel: Node;
  private head: DrawableModel<AttribProvider, ShaderProgram, Node>;
  private tail: DrawableModel<AttribProvider, ShaderProgram, Node>;
  constructor(ambients: UniformProvider) {
    this.model = new Node();
    var headMesh = new CylinderBuilder().setRadiusTop(0.0).setRadiusBottom(0.08).setHeight(0.2).buildMesh();
    var tailMesh = new CylinderBuilder().setRadiusTop(0.01).setRadiusBottom(0.01).buildMesh();
    var shaders = smartProgram(headMesh.getAttribMeta(), [this.model.getUniformMeta(), ambients.getUniformMeta()]);
    this.headModel = new Node();
    this.headModel.setParent(this.model);
    this.head = drawableModel(headMesh, shaders, this.headModel);
    this.tailModel = new Node();
    this.tailModel.setParent(this.model);
    this.tailModel.position.y = -0.2;
    this.setLength(1);
    this.tail = drawableModel(tailMesh, shaders, this.tailModel);
  }
  get length(): number {
    return this.tailModel.scale.y + 0.2;
  }
  set length(value: number) {
    this.setLength(value);
  }
  setLength(length: number): Arrow {
    this.headModel.position.y = (length/2)-0.2;
    this.tailModel.scale.y = length - 0.2;
    return this;
  }
  set color(value: Color) {
    this.headModel.color = value;
    this.tailModel.color = value;
  }
  get position(): Vector3 {
    return this.model.position;
  }
  set positione(value: Vector3) {
    this.model.position = value;
  }
  get attitude(): Spinor3 {
    return this.model.attitude;
  }
  set attitude(value: Spinor3) {
    this.model.attitude = value;
  }
  useProgram(): void {
    this.head.shaders.use();
  }
  draw(ambients: UniformProvider) {
    this.head.draw(ambients);
    this.tail.draw(ambients);
  }
  contextFree() {
    this.head.contextFree();
    this.tail.contextFree();
  }
  contextGain(context: WebGLRenderingContext, contextId: string) {
    this.head.contextGain(context, contextId);
    this.tail.contextGain(context, contextId);
  }
  contextLoss() {
    this.head.contextLoss();
    this.tail.contextLoss();
  }
  hasContext(): boolean {
    return this.head.hasContext();
  }
}

export = Arrow;
