import AttribMetaInfo from '../core/AttribMetaInfo';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import MonitorList from '../scene/MonitorList';
import fragmentShader from '../programs/fragmentShader';
import Mat2R from '../math/Mat2R';
import Mat3R from '../math/Mat3R';
import Mat4R from '../math/Mat4R';
import mergeStringMapList from '../utils/mergeStringMapList';
import mustBeDefined from '../checks/mustBeDefined';
import createGraphicsProgram from './createGraphicsProgram';
import IGraphicsProgram from '../core/IGraphicsProgram';
import UniformMetaInfo from '../core/UniformMetaInfo';
import vColorRequired from '../programs/vColorRequired';
import VectorE2 from '../math/VectorE2';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';
import vertexShader from '../programs/vertexShader';
import vLightRequired from '../programs/vLightRequired';

/**
 *
 */
export default function smartProgram(monitors: IContextMonitor[], attributes: { [name: string]: AttribMetaInfo }, uniformsList: { [name: string]: UniformMetaInfo }[], bindings: string[]): IGraphicsProgram {
    MonitorList.verify('monitors', monitors, () => { return "smartProgram"; });
    mustBeDefined('attributes', attributes);
    mustBeDefined('uniformsList', uniformsList);

    let uniforms = mergeStringMapList(uniformsList);

    let vColor: boolean = vColorRequired(attributes, uniforms);
    let vLight: boolean = vLightRequired(attributes, uniforms);

    let innerProgram: IGraphicsProgram = createGraphicsProgram(monitors, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);

    let self: IGraphicsProgram = {
        get uuid() {
            return innerProgram.uuid;
        },
        attributes() {
            return innerProgram.attributes();
        },
        uniforms() {
            return innerProgram.uniforms();
        },
        get vertexShader() {
            return innerProgram.vertexShader;
        },
        get fragmentShader() {
            return innerProgram.fragmentShader;
        },
        addRef() {
            return innerProgram.addRef();
        },
        release() {
            return innerProgram.release();
        },
        contextFree(manager: IContextProvider) {
            return innerProgram.contextFree(manager);
        },
        contextGain(manager: IContextProvider) {
            return innerProgram.contextGain(manager);
        },
        contextLost() {
            return innerProgram.contextLost();
        },
        use() {
            return innerProgram.use();
        },
        enableAttrib(name: string) {
            return innerProgram.enableAttrib(name);
        },
        disableAttrib(name: string) {
            return innerProgram.disableAttrib(name);
        },
        uniform1f(name: string, x: number) {
            return innerProgram.uniform1f(name, x);
        },
        uniform2f(name: string, x: number, y: number) {
            return innerProgram.uniform2f(name, x, y);
        },
        uniform3f(name: string, x: number, y: number, z: number) {
            return innerProgram.uniform3f(name, x, y, z);
        },
        uniform4f(name: string, x: number, y: number, z: number, w: number) {
            return innerProgram.uniform4f(name, x, y, z, w);
        },
        mat2(name: string, matrix: Mat2R, transpose: boolean) {
            return innerProgram.mat2(name, matrix, transpose);
        },
        mat3(name: string, matrix: Mat3R, transpose: boolean) {
            return innerProgram.mat3(name, matrix, transpose);
        },
        mat4(name: string, matrix: Mat4R, transpose: boolean) {
            return innerProgram.mat4(name, matrix, transpose);
        },
        vec2(name: string, vector: VectorE2) {
            return innerProgram.vec2(name, vector);
        },
        vec3(name: string, vector: VectorE3) {
            return innerProgram.vec3(name, vector);
        },
        vec4(name: string, vector: VectorE4) {
            return innerProgram.vec4(name, vector);
        },
        vector2(name: string, data: number[]): void {
            return innerProgram.vector2(name, data);
        },
        vector3(name: string, data: number[]): void {
            return innerProgram.vector3(name, data);
        },
        vector4(name: string, data: number[]): void {
            return innerProgram.vector4(name, data);
        }
    }

    return self;
}
