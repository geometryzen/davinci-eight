import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import Spinor3 = require('../math/Spinor3');
import Spinor3Coords = require('../math/Spinor3Coords');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import Color = require('../core/Color');
import Cartesian3 = require('../math/Cartesian3');
import UniformColor = require('../uniforms/UniformColor');

/**
 * @class TreeModel
 * @extends DefaultUniformProvider
 */
class TreeModel extends DefaultUniformProvider {
  private parent: TreeModel;
  private children: TreeModel[] = [];
  /**
   * @class Model
   * @constructor
   */
  constructor() {
    super();
  }
  getParent() {
    return this.parent;
  }
  setParent(parent: TreeModel) {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    if (parent) {
      parent.addChild(this);
    }
    this.parent = parent;
  }
  addChild(child: TreeModel) {
    this.children.push(this);
  }
  removeChild(child: TreeModel) {
    var index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }
  getUniformVector3(name: string): number[] {
    if (this.parent) {
      return this.parent.getUniformVector3(name);
    }
    else {
      return super.getUniformVector3(name);
    }
  }
  /**
   * @method getUniformMatrix3
   * @param name {string}
   */
  getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array} {
    if (this.parent) {
      return this.parent.getUniformMatrix3(name);
    }
    else {
      return super.getUniformMatrix3(name);
    }
  }
  /**
   * @method getUniformMatrix4
   * @param name {string}
   */
  getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array} {
    if (this.parent) {
      return this.parent.getUniformMatrix4(name);
    }
    else {
      return super.getUniformMatrix4(name);
    }
  }
  /**
   * @method getUniformMetaInfos
   */
  getUniformMetaInfos(): UniformMetaInfos {
    if (this.parent) {
      return this.parent.getUniformMetaInfos();
    }
    else {
      return super.getUniformMetaInfos();
    }
  }
}

export = TreeModel;
