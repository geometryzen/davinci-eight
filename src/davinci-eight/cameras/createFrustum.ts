import IFacetVisitor = require('../core/IFacetVisitor');
import Frustum = require('davinci-eight/cameras/Frustum');
import View = require('davinci-eight/cameras/View');
import createView  = require('davinci-eight/cameras/createView');
import Matrix4 = require('davinci-eight/math/Matrix4');
import MutableSpinorE3 = require('davinci-eight/math/MutableSpinorE3');
import Symbolic = require('davinci-eight/core/Symbolic');
import VectorE3 = require('davinci-eight/math/VectorE3');
import MutableNumber = require('../math/MutableNumber');
import MutableVectorE3 = require('../math/MutableVectorE3');

/**
 * @function createFrustum
 * @constructor
 * @return {Frustum}
 */
let createFrustum = function(viewMatrixName: string, projectionMatrixName: string): Frustum {

  let refCount = 1;
  let base: View = createView(viewMatrixName);
  let left: MutableNumber = new MutableNumber();
  let right: MutableNumber = new MutableNumber();
  let bottom: MutableNumber = new MutableNumber();
  let top: MutableNumber = new MutableNumber();
  let near: MutableNumber = new MutableNumber();
  let far: MutableNumber = new MutableNumber();
  // TODO: We should immediately create with a frustum static constructor?
  let projectionMatrix: Matrix4 = Matrix4.identity();

  function updateProjectionMatrix() {
    projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
  }

  updateProjectionMatrix();

  var self: Frustum = {
    addRef(): number {
      refCount++
      return refCount
    },
    release(): number {
      refCount--
      return refCount;
    },
    get uuid(): string {
      return ""
    },
    getProperty(name: string): number[] {
      return void 0
    },
    setProperty(name: string, value: number[]): void {
    },
    // Delegate to the base camera.
    get eye(): MutableVectorE3 {
      return base.eye;
    },
    set eye(value: MutableVectorE3) {
      base.eye = value;
    },
    setEye(eye: VectorE3) {
      base.setEye(eye);
      return self;
    },
    get look(): MutableVectorE3 {
      return base.look;
    },
    set look(value: MutableVectorE3) {
      base.look = value;
    },
    setLook(look: VectorE3) {
      base.setLook(look);
      return self;
    },
    get up(): MutableVectorE3 {
      return base.up;
    },
    set up(up: MutableVectorE3) {
      base.setUp(up);
    },
    setUp(up: VectorE3): Frustum {
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
    setUniforms(visitor: IFacetVisitor, canvasId: number) {
      visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix, canvasId);
      base.setUniforms(visitor, canvasId);
    }
  };

  return self;
};

export =  createFrustum;
