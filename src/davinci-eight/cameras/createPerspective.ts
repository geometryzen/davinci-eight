//
// createPerspective.ts
//
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Perspective        = require('../cameras/Perspective');
import View               = require('../cameras/View');
import createView         = require('../cameras/createView');
import Matrix4            = require('../math/Matrix4');
import Spinor3            = require('../math/Spinor3');
import Symbolic           = require('../core/Symbolic');
import Cartesian3         = require('../math/Cartesian3');
import Vector1            = require('../math/Vector1');
import Vector3            = require('../math/Vector3');
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
  let fov: Vector1 = new Vector1([isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov]);
  let aspect: Vector1 = new Vector1([isUndefined(options.aspect) ? 1 : options.aspect]);
  let near: Vector1 = new Vector1([isUndefined(options.near) ? 0.1 : options.near]);
  let far: Vector1 = new Vector1([expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value]);
  let projectionMatrixName = isUndefined(options.projectionMatrixName) ? Symbolic.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;

  let base: View = createView(options);
  let projectionMatrix: Matrix4 = Matrix4.identity();
  var matrixNeedsUpdate = true;

  let self: Perspective = {
    // Delegate to the base camera.
    get eye(): Vector3 {
      return base.eye;
    },
    set eye(eye: Vector3) {
      base.eye = eye;
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
    set up(value: Vector3) {
      base.up = value;
    },
    setUp(up: Cartesian3) {
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
    setUniforms(visitor: UniformDataVisitor, canvasId: number) {
      if (matrixNeedsUpdate) {
        computePerspectiveMatrix(fov.x, aspect.x, near.x, far.x, projectionMatrix);
        matrixNeedsUpdate = false;
      }
      // FIXME: canvasId being ignored
      visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix);
      base.setUniforms(visitor, canvasId);
    }
  };

  return self;
};

export =  createPerspective;
