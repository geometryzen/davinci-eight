import AttribMetaInfo = require('../core/AttribMetaInfo');
import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import MonitorList = require('../scene/MonitorList');
import expectArg = require('../checks/expectArg');
import fragmentShader = require('../programs/fragmentShader');
import isDefined = require('../checks/isDefined');
import R1 = require('../math/R1');
import Mat2R = require('../math/Mat2R');
import Mat3R = require('../math/Mat3R');
import Mat4R = require('../math/Mat4R');
import mergeStringMapList = require('../utils/mergeStringMapList');
import mustBeDefined = require('../checks/mustBeDefined');
import createGraphicsProgram = require('./createGraphicsProgram');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import vColorRequired = require('../programs/vColorRequired');
import VectorE2 = require('../math/VectorE2');
import VectorE3 = require('../math/VectorE3');
import VectorE4 = require('../math/VectorE4');
import vertexShader = require('../programs/vertexShader');
import vLightRequired = require('../programs/vLightRequired');

/**
 *
 */
var smartProgram = function(monitors: IContextMonitor[], attributes: { [name: string]: AttribMetaInfo }, uniformsList: { [name: string]: UniformMetaInfo }[], bindings: string[]): IGraphicsProgram {
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
        attributes(canvasId?: number) {
            return innerProgram.attributes(canvasId);
        },
        uniforms(canvasId?: number) {
            return innerProgram.uniforms(canvasId);
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
        contextFree(canvasId?: number) {
            return innerProgram.contextFree(canvasId);
        },
        contextGain(manager: IContextProvider) {
            return innerProgram.contextGain(manager);
        },
        contextLost(canvasId?: number) {
            return innerProgram.contextLost(canvasId);
        },
        use(canvasId?: number) {
            return innerProgram.use(canvasId);
        },
        enableAttrib(name: string, canvasId?: number) {
            return innerProgram.enableAttrib(name, canvasId);
        },
        disableAttrib(name: string, canvasId?: number) {
            return innerProgram.disableAttrib(name, canvasId);
        },
        uniform1f(name: string, x: number, canvasId?: number) {
            return innerProgram.uniform1f(name, x, canvasId);
        },
        uniform2f(name: string, x: number, y: number, canvasId?: number) {
            return innerProgram.uniform2f(name, x, y, canvasId);
        },
        uniform3f(name: string, x: number, y: number, z: number, canvasId?: number) {
            return innerProgram.uniform3f(name, x, y, z, canvasId);
        },
        uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId?: number) {
            return innerProgram.uniform4f(name, x, y, z, w, canvasId);
        },
        mat2(name: string, matrix: Mat2R, transpose?: boolean, canvasId?: number) {
            return innerProgram.mat2(name, matrix, transpose, canvasId);
        },
        mat3(name: string, matrix: Mat3R, transpose?: boolean, canvasId?: number) {
            return innerProgram.mat3(name, matrix, transpose, canvasId);
        },
        mat4(name: string, matrix: Mat4R, transpose?: boolean, canvasId?: number) {
            return innerProgram.mat4(name, matrix, transpose, canvasId);
        },
        vec2(name: string, vector: VectorE2, canvasId?: number) {
            return innerProgram.vec2(name, vector, canvasId);
        },
        vec3(name: string, vector: VectorE3, canvasId?: number) {
            return innerProgram.vec3(name, vector, canvasId);
        },
        vec4(name: string, vector: VectorE4, canvasId?: number) {
            return innerProgram.vec4(name, vector, canvasId);
        },
        vector2(name: string, data: number[], canvasId?: number): void {
            return innerProgram.vector2(name, data, canvasId);
        },
        vector3(name: string, data: number[], canvasId?: number): void {
            return innerProgram.vector3(name, data, canvasId);
        },
        vector4(name: string, data: number[], canvasId?: number): void {
            return innerProgram.vector4(name, data, canvasId);
        }
    }

    return self;
}

export = smartProgram;