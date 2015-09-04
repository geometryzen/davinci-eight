//
// frustum.ts
//
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Frustum = require('davinci-eight/cameras/Frustum');
import View = require('davinci-eight/cameras/View');
import view  = require('davinci-eight/cameras/view');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Symbolic = require('davinci-eight/core/Symbolic');
import Cartesian3 = require('davinci-eight/math/Cartesian3');
import Vector1 = require('../math/Vector1');
import Vector3 = require('../math/Vector3');

/**
 * @class frustum
 * @constructor
 * @return {Frustum}
 */
let frustum = function(viewMatrixName: string, projectionMatrixName: string): Frustum {

  let base: View = view(viewMatrixName);
  let left: Vector1 = new Vector1();
  let right: Vector1 = new Vector1();
  let bottom: Vector1 = new Vector1();
  let top: Vector1 = new Vector1();
  let near: Vector1 = new Vector1();
  let far: Vector1 = new Vector1();
  // TODO: We should immediately create with a frustum static constructor?
  let projectionMatrix: Matrix4 = Matrix4.identity();

  function updateProjectionMatrix() {
    projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
  }

  updateProjectionMatrix();

  var self: Frustum = {
    // Delegate to the base camera.
    get eye(): Vector3 {
      return base.eye;
    },
    set eye(value: Vector3) {
      base.eye = value;
    },
    setEye(eye: Cartesian3) {
      base.setEye(eye);
      return self;
    },
    get look(): Vector3 {
      return base.look;
    },
    set look(value: Vector3) {
      base.look = value;
    },
    setLook(look: Cartesian3) {
      base.setLook(look);
      return self;
    },
    get up(): Vector3 {
      return base.up;
    },
    set up(up: Vector3) {
      base.setUp(up);
    },
    setUp(up: Cartesian3): Frustum {
      base.setUp(up);
      return self;
    },
    get left(): number {
      return left.x;
    },
    set left(value: number) {
      left.x = value;
      updateProjectionMatrix();
    },
    get right(): number {
      return right.x;
    },
    set right(value: number) {
      right.x = value;
      updateProjectionMatrix();
    },
    get bottom(): number {
      return bottom.x;
    },
    set bottom(value: number) {
      bottom.x = value;
      updateProjectionMatrix();
    },
    get top(): number {
      return top.x;
    },
    set top(value: number) {
      top.x = value;
      updateProjectionMatrix();
    },
    get near(): number {
      return near.x;
    },
    set near(value: number) {
      near.x = value;
      updateProjectionMatrix();
    },
    get far(): number {
      return far.x;
    },
    set far(value: number) {
      far.x = value;
      updateProjectionMatrix();
    },
    accept(visitor: UniformDataVisitor) {
      visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix);
      base.accept(visitor);
    }
  };

  return self;
};

export =  frustum;
