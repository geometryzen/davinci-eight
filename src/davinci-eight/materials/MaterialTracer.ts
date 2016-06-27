import ContextProvider from '../core/ContextProvider';
import {Material} from '../core/Material';
import Matrix2 from '../math/Matrix2';
import Matrix3 from '../math/Matrix3';
import Matrix4 from '../math/Matrix4';
import VectorE2 from '../math/VectorE2';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';

export default class MaterialTracer implements Material {
    constructor(private inner: Material) {
        // Do nothing.
    }
    get vertexShaderSrc() {
        return this.inner.vertexShaderSrc;
    }
    get fragmentShaderSrc() {
        return this.inner.fragmentShaderSrc;
    }
    getAttribLocation(name: string) {
        console.log(`getAttribLocation(${name})`)
        return this.inner.getAttribLocation(name)
    }
    enableAttrib(indexOrName: number | string) {
        console.log(`enableAttrib(${indexOrName})`)
        return this.inner.enableAttrib(indexOrName);
    }
    disableAttrib(indexOrName: number | string) {
        console.log(`disableAttrib(${indexOrName})`)
        return this.inner.disableAttrib(indexOrName);
    }
    vertexPointer(indexOrName: number | string, size: number, normalized: boolean, stride: number, offset: number) {
        console.log(`vertexPointer(${indexOrName})`)
        return this.inner.vertexPointer(indexOrName, size, normalized, stride, offset)
    }
    getUniformLocation(name: string) {
        return this.inner.getUniformLocation(name)
    }
    use() {
        return this.inner.use();
    }
    mat2(name: string, matrix: Matrix2, transpose: boolean) {
        return this.inner.mat2(name, matrix, transpose);
    }
    mat3(name: string, matrix: Matrix3, transpose: boolean) {
        return this.inner.mat3(name, matrix, transpose);
    }
    mat4(name: string, matrix: Matrix4, transpose: boolean) {
        return this.inner.mat4(name, matrix, transpose);
    }
    uniform1f(name: string, x: number) {
        return this.inner.uniform1f(name, x)
    }
    uniform2f(name: string, x: number, y: number) {
        return this.inner.uniform2f(name, x, y)
    }
    uniform3f(name: string, x: number, y: number, z: number) {
        return this.inner.uniform3f(name, x, y, z)
    }
    uniform4f(name: string, x: number, y: number, z: number, w: number) {
        return this.inner.uniform4f(name, x, y, z, w)
    }
    vec2(name: string, vector: VectorE2) {
        return this.inner.vec2(name, vector)
    }
    vec3(name: string, vector: VectorE3) {
        return this.inner.vec3(name, vector)
    }
    vec4(name: string, vector: VectorE4) {
        return this.inner.vec4(name, vector)
    }
    vector2fv(name: string, data: Float32Array) {
        return this.inner.vector2fv(name, data)
    }
    vector3fv(name: string, data: Float32Array) {
        return this.inner.vector3fv(name, data)
    }
    vector4fv(name: string, data: Float32Array) {
        return this.inner.vector4fv(name, data)
    }
    contextFree(context: ContextProvider) {
        this.inner.contextFree(context)
    }
    contextGain(context: ContextProvider) {
        this.inner.contextGain(context)
    }
    contextLost() {
        this.inner.contextLost()
    }
    addRef(): number {
        return this.inner.addRef();
    }
    release(): number {
        return this.inner.release();
    }
}
