import Attrib from '../core/Attrib';
import ContextProvider from '../core/ContextProvider';
import {Material} from '../core/Material';
import Uniform from '../core/Uniform';

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
    getAttrib(indexOrName: number | string): Attrib {
        return this.inner.getAttrib(indexOrName);
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
    getUniform(name: string): Uniform {
        return this.inner.getUniform(name)
    }
    getUniformLocation(name: string) {
        return this.inner.getUniform(name)
    }
    use() {
        return this.inner.use();
    }
    matrix2fv(name: string, matrix: Float32Array, transpose: boolean) {
        return this.inner.matrix2fv(name, matrix, transpose);
    }
    matrix3fv(name: string, matrix: Float32Array, transpose: boolean) {
        return this.inner.matrix3fv(name, matrix, transpose);
    }
    matrix4fv(name: string, matrix: Float32Array, transpose: boolean) {
        return this.inner.matrix4fv(name, matrix, transpose);
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
