import { TextureUnit } from './TextureUnit';

/**
 * A facet visitor implementation is able to accept a value to be assigned to a WebGL uniform in a WebGL program.
 * This interface is normally only implemented by a Material.
 */
export interface FacetVisitor {

    /**
     * Informs the facet visitor of which texture unit is to be used.
     * @param unit The texture unit to be used.
     */
    activeTexture(unit: TextureUnit): void;

    matrix2fv(name: string, mat2: Float32Array, transpose: boolean): void;
    matrix3fv(name: string, mat3: Float32Array, transpose: boolean): void;
    matrix4fv(name: string, mat4: Float32Array, transpose: boolean): void;

    uniform1f(name: string, x: number): void;
    uniform1fv(name: string, data: Float32Array, srcOffset: number, srcLength: number): void;
    uniform1i(name: string, x: number): void;
    uniform1iv(name: string, data: Int32Array, srcOffset?: number, srcLength?: number): void;

    uniform2f(name: string, x: number, y: number): void;
    uniform2fv(name: string, data: Float32Array, srcOffset?: number, srcLength?: number): void;
    uniform2i(name: string, x: number, y: number): void;
    uniform2iv(name: string, data: Int32Array, srcOffset?: number, srcLength?: number): void;

    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform3fv(name: string, data: Float32Array, srcOffset?: number, srcLength?: number): void;
    uniform3i(name: string, x: number, y: number, z: number): void;
    uniform3iv(name: string, data: Int32Array, srcOffset?: number, srcLength?: number): void;

    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    uniform4fv(name: string, data: Float32Array, srcOffset?: number, srcLength?: number): void;
    uniform4i(name: string, x: number, y: number, z: number, w: number): void;
    uniform4iv(name: string, data: Int32Array, srcOffset?: number, srcLength?: number): void;
}
