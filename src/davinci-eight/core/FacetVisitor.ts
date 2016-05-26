import VectorE2 from '../math/VectorE2';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';
import Matrix2 from '../math/Matrix2';
import Matrix3 from '../math/Matrix3';
import Matrix4 from '../math/Matrix4';

/**
 *
 */
export interface FacetVisitor {

    /**
     * @param name
     * @param matrix
     * @param transpose
     */
    mat2(name: string, matrix: Matrix2, transpose: boolean): void;

    /**
     * @param name
     * @param matrix
     * @param transpose
     */
    mat3(name: string, matrix: Matrix3, transpose: boolean): void;

    /**
     * @param name
     * @param matrix
     * @param transpose
     */
    mat4(name: string, matrix: Matrix4, transpose: boolean): void;

    /**
     * @param name
     * @param x
     */
    uniform1f(name: string, x: number): void;

    /**
     * @param name
     * @param x
     * @param y
     */
    uniform2f(name: string, x: number, y: number): void;

    /**
     * @param name
     * @param x
     * @param y
     * @param z
     */
    uniform3f(name: string, x: number, y: number, z: number): void;

    /**
     * @param name
     * @param x
     * @param y
     * @param z
     * @param w
     */
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;

    /**
     * @param name
     * @param vector
     */
    vec2(name: string, vector: VectorE2): void;

    /**
     * @param name
     * @param vector
     */
    vec3(name: string, vector: VectorE3): void;

    /**
     * @param name
     * @param vector
     */
    vec4(name: string, vector: VectorE4): void;

    /**
     * @param name
     * @param data
     */
    vector2fv(name: string, data: Float32Array): void;

    /**
     * @param name
     * @param data
     */
    vector3fv(name: string, data: Float32Array): void;

    /**
     * @param name
     * @param data
     */
    vector4fv(name: string, data: Float32Array): void;
}
