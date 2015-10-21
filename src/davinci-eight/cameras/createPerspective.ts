//
// createPerspective.ts
//
import IFacetVisitor = require('../core/IFacetVisitor');
import Perspective        = require('../cameras/Perspective');
import View               = require('../cameras/View');
import createView         = require('../cameras/createView');
import Matrix4            = require('../math/Matrix4');
import MutableSpinorE3            = require('../math/MutableSpinorE3');
import Symbolic           = require('../core/Symbolic');
import VectorE3         = require('../math/VectorE3');
import MutableNumber            = require('../math/MutableNumber');
import MutableVectorE3            = require('../math/MutableVectorE3');
import isDefined          = require('../checks/isDefined');
import isUndefined        = require('../checks/isUndefined');
import expectArg          = require('../checks/expectArg');
import computePerspectiveMatrix = require('../cameras/perspectiveMatrix');

/**
 * @function createPerspective
 * @constructor
 * @param fov {number}
 * @param aspect {number}
 * @param near {number}
 * @param far {number}
 * @return {Perspective}
 */
let createPerspective = function(options?: { fov?: number; aspect?: number; near?: number; far?: number; projectionMatrixName?: string; viewMatrixName?: string;}): Perspective {

  options = options || {};
  let fov: MutableNumber = new MutableNumber([isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov]);
  let aspect: MutableNumber = new MutableNumber([isUndefined(options.aspect) ? 1 : options.aspect]);
  let near: MutableNumber = new MutableNumber([isUndefined(options.near) ? 0.1 : options.near]);
  let far: MutableNumber = new MutableNumber([expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value]);
  let projectionMatrixName = isUndefined(options.projectionMatrixName) ? Symbolic.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;

  var refCount = 1
  let base: View = createView(options)
  let projectionMatrix: Matrix4 = Matrix4.identity()
  var matrixNeedsUpdate = true

  let self: Perspective = {
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
    set eye(eye: MutableVectorE3) {
      base.eye = eye;
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
    set up(value: MutableVectorE3) {
      base.up = value;
    },
    setUp(up: VectorE3) {
      base.setUp(up);
      return self;
    },
    get fov(): number {
      return fov.x;
    },
    set fov(value: number) {
      self.setFov(value);
    },
    setFov(value: number) {
      expectArg('fov', value).toBeNumber();
      matrixNeedsUpdate = matrixNeedsUpdate || fov.x !== value;
      fov.x = value;
      return self;
    },
    get aspect(): number {
      return aspect.x;
    },
    set aspect(value: number) {
      self.setAspect(value);
    },
    setAspect(value: number) {
      expectArg('aspect', value).toBeNumber();
      matrixNeedsUpdate = matrixNeedsUpdate || aspect.x !== value;
      aspect.x = value;
      return self;
    },
    get near(): number {
      return near.x;
    },
    set near(value: number) {
      self.setNear(value);
    },
    setNear(value: number) {
      expectArg('near', value).toBeNumber();
      matrixNeedsUpdate = matrixNeedsUpdate || near.x !== value;
      near.x = value;
      return self;
    },
    get far(): number {
      return far.x;
    },
    set far(value: number) {
      self.setFar(value);
    },
    setFar(value: number) {
      expectArg('far', value).toBeNumber();
      matrixNeedsUpdate = matrixNeedsUpdate || far.x !== value;
      far.x = value;
      return self;
    },
    setUniforms(visitor: IFacetVisitor, canvasId: number) {
      if (matrixNeedsUpdate) {
        computePerspectiveMatrix(fov.x, aspect.x, near.x, far.x, projectionMatrix);
        matrixNeedsUpdate = false;
      }
      visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix, canvasId);
      base.setUniforms(visitor, canvasId);
    }
  };

  return self;
};

export =  createPerspective;
