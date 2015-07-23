//
// frustum.ts
//
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Frustum = require('davinci-eight/cameras/Frustum');
import View = require('davinci-eight/cameras/View');
import view  = require('davinci-eight/cameras/view');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Symbolic = require('davinci-eight/core/Symbolic');
import Cartesian3 = require('davinci-eight/math/Cartesian3');

let UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
let UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';

/**
 * @class frustum
 * @constructor
 * @param left {number}
 * @param right {number}
 * @param bottom {number}
 * @param top {number}
 * @param near {number}
 * @param far {number}
 * @return {Frustum}
 */
var frustum = function(left: number = -1, right: number = 1, bottom: number = -1, top: number = 1, near: number = 1, far: number = 1000): Frustum {

  var base: View = view();
  var projectionMatrix = new Matrix4();

  function updateProjectionMatrix() {
    projectionMatrix.frustum(left, right, bottom, top, near, far);
  }

  updateProjectionMatrix();

  var publicAPI: Frustum = {
    // Delegate to the base camera.
    get eye(): Cartesian3 {
      return base.eye;
    },
    set eye(value: Cartesian3) {
      base.eye = value;
    },
    get look(): Cartesian3 {
      return base.look;
    },
    set look(value: Cartesian3) {
      base.look = value;
    },
    get up(): Cartesian3 {
      return base.up;
    },
    set up(value: Cartesian3) {
      base.up = value;
    },
    get left(): number {
      return left;
    },
    set left(value: number) {
      left = value;
      updateProjectionMatrix();
    },
    get right(): number {
      return right;
    },
    set right(value: number) {
      right = value;
      updateProjectionMatrix();
    },
    get bottom(): number {
      return bottom;
    },
    set bottom(value: number) {
      bottom = value;
      updateProjectionMatrix();
    },
    get top(): number {
      return top;
    },
    set top(value: number) {
      top = value;
      updateProjectionMatrix();
    },
    get near(): number {
      return near;
    },
    set near(value: number) {
      near = value;
      updateProjectionMatrix();
    },
    get far(): number {
      return far;
    },
    set far(value: number) {
      far = value;
      updateProjectionMatrix();
    },
    getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array} {
      return base.getUniformMatrix3(name);
    },
    getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array} {
      switch(name) {
        case UNIFORM_PROJECTION_MATRIX_NAME: {
          return {transpose: false, matrix4: projectionMatrix.elements};
        }
        default: {
          return base.getUniformMatrix4(name);
        }
      }
    },
    getUniformVector2(name: string): number[] {
      return base.getUniformVector2(name);
    },
    getUniformVector3(name: string): number[] {
      return base.getUniformVector3(name);
    },
    getUniformVector4(name: string): number[] {
      return base.getUniformVector4(name);
    },
    getUniformMetaInfos(): UniformMetaInfos {
      var uniforms: UniformMetaInfos = base.getUniformMetaInfos();
      uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX]  = {name: UNIFORM_PROJECTION_MATRIX_NAME, type: UNIFORM_PROJECTION_MATRIX_TYPE};
      return uniforms;
    }
  };

  return publicAPI;
};

export =  frustum;
