import VectorE2 from '../math/VectorE2';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';
import Mat2R from '../math/Mat2R';
import Mat3R from '../math/Mat3R';
import Mat4R from '../math/Mat4R';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class FacetVisitor
 * @beta
 */
interface FacetVisitor {

    /**
     * @method uniform1f
     * @param name {string}
     * @param x {number}
     * @return {void}
     */
    uniform1f(name: string, x: number): void;

    /**
     * @method uniform2f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @return {void}
     */
    uniform2f(name: string, x: number, y: number): void;

    /**
     * @method uniform3f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {void}
     */
    uniform3f(name: string, x: number, y: number, z: number): void;

    /**
     * @method uniform3f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param w {number}
     * @return {void}
     */
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;

    /**
     * @method mat2
     * @param name {string}
     * @param matrix {Mat2R}
     * @param [transpose = false] {boolean}
     * @return {void}
     */
    mat2(name: string, matrix: Mat2R, transpose: boolean): void;

    /**
     * @method mat3
     * @param name {string}
     * @param matrix {Mat3R}
     * @param [transpose = false] {boolean}
     * @return {void}
     */
    mat3(name: string, matrix: Mat3R, transpose: boolean): void;

    /**
     * @method mat4
     * @param name {string}
     * @param matrix {Mat4R}
     * @param [transpose = false] {boolean}
     * @return {void}
     */
    mat4(name: string, matrix: Mat4R, transpose: boolean): void;

    /**
     * @method vec2
     * @param name {string}
     * @param vector {VectorE2}
     * @return {void}
     */
    vec2(name: string, vector: VectorE2): void;

    /**
     * @method vec3
     * @param name {string}
     * @param vector {VectorE3}
     * @return {void}
     */
    vec3(name: string, vector: VectorE3): void;

    /**
     * @method vec4
     * @param name {string}
     * @param vector {VectorE4}
     * @return {void}
     */
    vec4(name: string, vector: VectorE4): void;

    /**
     * @method vector2
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    vector2(name: string, data: number[]): void;

    /**
     * @method vector3
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    vector3(name: string, data: number[]): void;

    /**
     * @method vector4
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    vector4(name: string, data: number[]): void;
}

export default FacetVisitor;
