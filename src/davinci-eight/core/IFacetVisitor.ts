import VectorE1 = require('../math/VectorE1');
import VectorE2 = require('../math/VectorE2');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');
import R1 = require('../math/R1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');

/**
 * @class IFacetVisitor
 * @beta
 */
interface IFacetVisitor {

  /**
   * @method uniform1f
   * @param name {string}
   * @param x {number}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniform1f(name: string, x: number, canvasId?: number): void;

  /**
   * @method uniform2f
   * @param name {string}
   * @param x {number}
   * @param y {number}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniform2f(name: string, x: number, y: number, canvasId?: number): void;

  /**
   * @method uniform3f
   * @param name {string}
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniform3f(name: string, x: number, y: number, z: number, canvasId?: number): void;

  /**
   * @method uniform3f
   * @param name {string}
   * @param x {number}
   * @param y {number}
   * @param z {number}
   * @param w {number}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId?: number): void;

  /**
   * @method uniformMatrix2
   * @param name {string}
   * @param transpose {boolean}
   * @param matrix {Matrix2}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2, canvasId?: number): void;

  /**
   * @method uniformMatrix3
   * @param name {string}
   * @param transpose {boolean}
   * @param matrix {Matrix3}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3, canvasId?: number): void;

  /**
   * @method uniformMatrix4
   * @param name {string}
   * @param transpose {boolean}
   * @param matrix {Matrix4}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4, canvasId?: number): void;

  /**
   * @method uniformVectorE2
   * @param name {string}
   * @param vector {VectorE2}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniformVectorE2(name: string, vector: VectorE2, canvasId?: number): void;

  /**
   * @method uniformVectorE3
   * @param name {string}
   * @param vector {VectorE3}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniformVectorE3(name: string, vector: VectorE3, canvasId?: number): void;

  /**
   * @method uniformVectorE4
   * @param name {string}
   * @param vector {VectorE4}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  uniformVectorE4(name: string, vector: VectorE4, canvasId?: number): void;

  /**
   * @method vector2
   * @param name {string}
   * @param data {number[]}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  vector2(name: string, data: number[], canvasId?: number): void;

  /**
   * @method vector3
   * @param name {string}
   * @param data {number[]}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  vector3(name: string, data: number[], canvasId?: number): void;

  /**
   * @method vector4
   * @param name {string}
   * @param data {number[]}
   * @param [canvasId] {number} Determines which WebGLProgram to use.
   * @return {void}
   */
  vector4(name: string, data: number[], canvasId?: number): void;
}

export = IFacetVisitor;