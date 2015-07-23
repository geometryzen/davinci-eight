//
// perspective.ts
//
import UniformMetaInfos = require('../core/UniformMetaInfos');
import LinearPerspectiveCamera = require('davinci-eight/cameras/LinearPerspectiveCamera');
import View = require('davinci-eight/cameras/View');
import view  = require('davinci-eight/cameras/view');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Symbolic = require('davinci-eight/core/Symbolic');
import Cartesian3 = require('davinci-eight/math/Cartesian3');

let UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
let UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';

/**
 * @class perspective
 * @constructor
 * @param fov {number}
 * @param aspect {number}
 * @param near {number}
 * @param far {number}
 * @return {LinearPerspectiveCamera}
 */
var perspective = function(fov: number = 75 * Math.PI / 180, aspect: number = 1, near: number = 0.1, far: number = 2000): LinearPerspectiveCamera {

  var base: View = view();
  var projectionMatrix = new Matrix4();
  var matrixNeedsUpdate = true;

  var publicAPI: LinearPerspectiveCamera = {
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
    get fov(): number {
      return fov;
    },
    set fov(value: number) {
      fov = value;
      matrixNeedsUpdate = matrixNeedsUpdate || fov !== value;
    },
    get aspect(): number {
      return aspect;
    },
    set aspect(value: number) {
      aspect = value;
      matrixNeedsUpdate = matrixNeedsUpdate || aspect !== value;
    },
    get near(): number {
      return near;
    },
    set near(value: number) {
      near = value;
      matrixNeedsUpdate = matrixNeedsUpdate || near !== value;
    },
    get far(): number {
      return far;
    },
    set far(value: number) {
      far = value;
      matrixNeedsUpdate = matrixNeedsUpdate || far !== value;
    },
    getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array} {
      return base.getUniformMatrix3(name);
    },
    getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array} {
      switch(name) {
        case UNIFORM_PROJECTION_MATRIX_NAME: {
          if (matrixNeedsUpdate) {
            projectionMatrix.perspective(fov, aspect, near, far);
            matrixNeedsUpdate = false;
          }
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
      uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX]  = {name: UNIFORM_PROJECTION_MATRIX_NAME, glslType: UNIFORM_PROJECTION_MATRIX_TYPE};
      return uniforms;
    }
  };

  return publicAPI;
};

export =  perspective;
