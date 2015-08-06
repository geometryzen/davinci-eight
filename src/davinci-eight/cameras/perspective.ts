//
// perspective.ts
//
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Perspective = require('davinci-eight/cameras/Perspective');
import View = require('davinci-eight/cameras/View');
import view  = require('davinci-eight/cameras/view');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Symbolic = require('davinci-eight/core/Symbolic');
import Cartesian3 = require('davinci-eight/math/Cartesian3');
import isUndefined = require('../checks/isUndefined');
import expectArg = require('../checks/expectArg');

//let UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';

/**
 * @class perspective
 * @constructor
 * @param fov {number}
 * @param aspect {number}
 * @param near {number}
 * @param far {number}
 * @return {Perspective}
 */
let perspective = function(options?: {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    projectionMatrixName?: string;
    viewMatrixName?:string
  }
  ): Perspective {

  options = options || {};
  let fov: number = isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov;
  let aspect: number = isUndefined(options.aspect) ? 1 : options.aspect;
  let near: number = isUndefined(options.near) ? 0.1 : options.near;
  let far: number = expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value;
  let projectionMatrixName = isUndefined(options.projectionMatrixName) ? Symbolic.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;

  let base: View = view(options);
  let projectionMatrix = Matrix4.identity();
  var matrixNeedsUpdate = true;

  let self: Perspective = {
    // Delegate to the base camera.
    get eye(): Cartesian3 {
      return base.eye;
    },
    set eye(eye: Cartesian3) {
      base.eye = eye;
    },
    setEye(eye: Cartesian3) {
      base.setEye(eye);
      return self;
    },
    get look(): Cartesian3 {
      return base.look;
    },
    set look(value: Cartesian3) {
      base.look = value;
    },
    setLook(look: Cartesian3) {
      base.setLook(look);
      return self;
    },
    get up(): Cartesian3 {
      return base.up;
    },
    set up(value: Cartesian3) {
      base.up = value;
    },
    setUp(up: Cartesian3) {
      base.setUp(up);
      return self;
    },
    get fov(): number {
      return fov;
    },
    set fov(value: number) {
      self.setFov(value);
    },
    setFov(value: number) {
      expectArg('fov', value).toBeNumber();
      matrixNeedsUpdate = matrixNeedsUpdate || fov !== value;
      fov = value;
      return self;
    },
    get aspect(): number {
      return aspect;
    },
    set aspect(value: number) {
      self.setAspect(value);
    },
    setAspect(value: number) {
      expectArg('aspect', value).toBeNumber();
      matrixNeedsUpdate = matrixNeedsUpdate || aspect !== value;
      aspect = value;
      return self;
    },
    get near(): number {
      return near;
    },
    set near(value: number) {
      self.setNear(value);
    },
    setNear(value: number) {
      expectArg('near', value).toBeNumber();
      matrixNeedsUpdate = matrixNeedsUpdate || near !== value;
      near = value;
      return self;
    },
    get far(): number {
      return far;
    },
    set far(value: number) {
      self.setFar(value);
    },
    setFar(value: number) {
      expectArg('far', value).toBeNumber();
      matrixNeedsUpdate = matrixNeedsUpdate || far !== value;
      far = value;
      return self;
    },
    getUniformFloat(name: string): number {
      return base.getUniformFloat(name);
    },
    getUniformMatrix2(name: string): {transpose: boolean; matrix2: Float32Array} {
      return base.getUniformMatrix2(name);
    },
    getUniformMatrix3(name: string): {transpose: boolean; matrix3: Float32Array} {
      return base.getUniformMatrix3(name);
    },
    getUniformMatrix4(name: string): {transpose: boolean; matrix4: Float32Array} {
      expectArg('name', name).toBeString();
      switch(name) {
        case projectionMatrixName: {
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
    getUniformMeta(): UniformMetaInfos {
      var uniforms: UniformMetaInfos = base.getUniformMeta();
      uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX]  = {name: projectionMatrixName, glslType: 'mat4'};
      return uniforms;
    }
  };

  return self;
};

export =  perspective;
