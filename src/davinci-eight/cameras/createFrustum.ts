import IFacetVisitor = require('../core/IFacetVisitor');
import Frustum = require('davinci-eight/cameras/Frustum');
import View = require('davinci-eight/cameras/View');
import createView  = require('davinci-eight/cameras/createView');
import Matrix4 = require('davinci-eight/math/Matrix4');
import SpinG3 = require('davinci-eight/math/SpinG3');
import GraphicsProgramSymbols = require('davinci-eight/core/GraphicsProgramSymbols');
import VectorE3 = require('davinci-eight/math/VectorE3');
import R1 = require('../math/R1');
import R3 = require('../math/R3');

/**
 * @function createFrustum
 * @constructor
 * @return {Frustum}
 */
let createFrustum = function(viewMatrixName: string, projectionMatrixName: string): Frustum {

  let refCount = 1;
  let base: View = createView(viewMatrixName);
  let left: R1 = new R1();
  let right: R1 = new R1();
  let bottom: R1 = new R1();
  let top: R1 = new R1();
  let near: R1 = new R1();
  let far: R1 = new R1();
  // TODO: We should immediately create with a frustum static constructor?
  let projectionMatrix: Matrix4 = Matrix4.one();

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
    get eye(): R3 {
      return base.eye;
    },
    set eye(value: R3) {
      base.eye = value;
    },
    setEye(eye: VectorE3) {
      base.setEye(eye);
      return self;
    },
    get look(): R3 {
      return base.look;
    },
    set look(value: R3) {
      base.look = value;
    },
    setLook(look: VectorE3) {
      base.setLook(look);
      return self;
    },
    get up(): R3 {
      return base.up;
    },
    set up(up: R3) {
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
    setUniforms(visitor: IFacetVisitor, canvasId?: number) {
      visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix, canvasId);
      base.setUniforms(visitor, canvasId);
    }
  };

  return self;
};

export =  createFrustum;
