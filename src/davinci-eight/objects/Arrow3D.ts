import AttribProvider = require('../core/AttribProvider');
import Color = require('../core/Color');
import CylinderMeshBuilder = require('../mesh/CylinderMeshBuilder');
import Drawable = require('../core/Drawable');
import DrawableVisitor = require('../core/DrawableVisitor');
import Primitive = require('../core/Primitive');
import Composite = require('../core/Composite');
import primitive = require('../objects/primitive');
import ShaderProgram = require('../core/ShaderProgram');
import smartProgram = require('../programs/smartProgram')
import Spinor3 = require('../math/Spinor3');
import Node = require('../uniforms/Node');
import UniformProvider = require('../core/UniformProvider');
import Vector3 = require('../math/Vector3');
import Object3D = require('../objects/Object3D');
import ArrowOptions = require('../mesh/ArrowOptions');
import Blade = require('../objects/Blade');
import isDefined = require('../checks/isDefined');

class Arrow3D implements Blade<Node> {
  private $magnitude: number = 1;
  private $coneHeight: number;
  public model: Node;
  public program: ShaderProgram;
  private headModel: Node;
  private tailModel: Node;
  private head: Primitive<AttribProvider, Node>;
  private tail: Primitive<AttribProvider, Node>;
  private _refCount: number = 0;
  constructor(ambients: UniformProvider, options?: ArrowOptions) {
    options = options || {};
    this.$coneHeight = isDefined(options.coneHeight) ? options.coneHeight : 0.2;
    this.model = new Node();
    var headMesh = new CylinderMeshBuilder(options).setRadiusTop(0.0).setRadiusBottom(0.08).setHeight(this.$coneHeight).buildMesh();
    var tailMesh = new CylinderMeshBuilder(options).setRadiusTop(0.01).setRadiusBottom(0.01).buildMesh();
    this.program = smartProgram(headMesh.getAttribMeta(), [this.model.getUniformMeta(), ambients.getUniformMeta()]);
    this.headModel = new Node();
    this.headModel.setParent(this.model);
    this.head = primitive(headMesh, this.program, this.headModel);
    this.tailModel = new Node();
    this.tailModel.setParent(this.model);
    this.setMagnitude(1);
    this.tail = primitive(tailMesh, this.program, this.tailModel);
  }
  get magnitude(): number {
    return this.tailModel.scale.y + this.$coneHeight;
  }
  set magnitude(value: number) {
    this.setMagnitude(value);
  }
  setMagnitude(magnitude: number): Blade<Node> {
    this.headModel.position.y = (magnitude - this.$coneHeight) / 2;
    this.tailModel.scale.y = magnitude - this.$coneHeight;
    this.tailModel.position.y = - this.$coneHeight / 2;
    return this;
  }
  /**
   *
   */
  accept(visitor: DrawableVisitor) {
    this.head.accept(visitor);
    this.tail.accept(visitor);
  }
  addRef() {
    this._refCount++;
  }
  release() {
    this._refCount--;
    if (this._refCount === 0) {
      this.head.release();
      this.tail.release();
    }
  }
  contextFree() {
    this.head.contextFree();
    this.tail.contextFree();
  }
  contextGain(context: WebGLRenderingContext) {
    this.head.contextGain(context);
    this.tail.contextGain(context);
  }
  contextLoss() {
    this.head.contextLoss();
    this.tail.contextLoss();
  }
  hasContext() {
    return this.head.hasContext();
  }
}

export = Arrow3D;
