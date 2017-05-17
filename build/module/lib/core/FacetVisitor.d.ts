import { TextureUnit } from './TextureUnit';
export interface FacetVisitor {
    activeTexture(unit: TextureUnit): void;
    matrix2fv(name: string, mat2: Float32Array, transpose: boolean): void;
    matrix3fv(name: string, mat3: Float32Array, transpose: boolean): void;
    matrix4fv(name: string, mat4: Float32Array, transpose: boolean): void;
    uniform1i(name: string, x: number): void;
    uniform1f(name: string, x: number): void;
    uniform2f(name: string, x: number, y: number): void;
    uniform3f(name: string, x: number, y: number, z: number): void;
    uniform4f(name: string, x: number, y: number, z: number, w: number): void;
    vector2fv(name: string, vec2: Float32Array): void;
    vector3fv(name: string, vec3: Float32Array): void;
    vector4fv(name: string, vec4: Float32Array): void;
}
