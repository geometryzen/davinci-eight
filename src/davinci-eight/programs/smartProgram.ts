import AttribMetaInfo = require('../core/AttribMetaInfo');
import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import MonitorList = require('../scene/MonitorList');
import expectArg = require('../checks/expectArg');
import fragmentShader = require('../programs/fragmentShader');
import isDefined = require('../checks/isDefined');
import MutableNumber = require('../math/MutableNumber');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import mergeStringMapList = require('../utils/mergeStringMapList');
import mustBeDefined = require('../checks/mustBeDefined');
import createMaterial = require('./createMaterial');
import IMaterial = require('../core/IMaterial');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import vColorRequired = require('../programs/vColorRequired');
import MutableVectorE2 = require('../math/MutableVectorE2');
import MutableVectorE3 = require('../math/MutableVectorE3');
import MutableVectorE4 = require('../math/MutableVectorE4');
import vertexShader = require('../programs/vertexShader');
import vLightRequired = require('../programs/vLightRequired');

/**
 *
 */
var smartProgram = function(monitors: IContextMonitor[], attributes: { [name: string]: AttribMetaInfo }, uniformsList: { [name: string]: UniformMetaInfo }[], bindings: string[]): IMaterial {
  MonitorList.verify('monitors', monitors, () => { return "smartProgram"; });
  mustBeDefined('attributes', attributes);
  mustBeDefined('uniformsList', uniformsList);
 
  let uniforms = mergeStringMapList(uniformsList);

  let vColor: boolean = vColorRequired(attributes, uniforms);
  let vLight: boolean = vLightRequired(attributes, uniforms);

  let innerProgram: IMaterial = createMaterial(monitors, vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);

  let self: IMaterial = {
    get programId() {
      return innerProgram.programId;
    },
    attributes(canvasId: number) {
      return innerProgram.attributes(canvasId);
    },
    uniforms(canvasId: number) {
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
    contextFree(canvasId: number) {
      return innerProgram.contextFree(canvasId);
    },
    contextGain(manager: IContextProvider) {
      return innerProgram.contextGain(manager);
    },
    contextLost(canvasId: number) {
      return innerProgram.contextLost(canvasId);
    },
    use(canvasId: number) {
      return innerProgram.use(canvasId);
    },
    enableAttrib(name: string, canvasId: number) {
      return innerProgram.enableAttrib(name, canvasId);
    },
    disableAttrib(name: string, canvasId: number) {
      return innerProgram.disableAttrib(name, canvasId);
    },
    uniform1f(name: string, x: number, canvasId: number) {
      return innerProgram.uniform1f(name, x, canvasId);
    },
    uniform2f(name: string, x: number, y: number, canvasId: number) {
      return innerProgram.uniform2f(name, x, y, canvasId);
    },
    uniform3f(name: string, x: number, y: number, z: number, canvasId: number) {
      return innerProgram.uniform3f(name, x, y, z, canvasId);
    },
    uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId: number) {
      return innerProgram.uniform4f(name, x, y, z, w, canvasId);
    },
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2, canvasId: number) {
      return innerProgram.uniformMatrix2(name, transpose, matrix, canvasId);
    },
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3, canvasId: number) {
      return innerProgram.uniformMatrix3(name, transpose, matrix, canvasId);
    },
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4, canvasId: number) {
      return innerProgram.uniformMatrix4(name, transpose, matrix, canvasId);
    },
    uniformVectorE2(name: string, vector: MutableVectorE2, canvasId: number) {
      return innerProgram.uniformVectorE2(name, vector, canvasId);
    },
    uniformVectorE3(name: string, vector: MutableVectorE3, canvasId: number) {
      return innerProgram.uniformVectorE3(name, vector, canvasId);
    },
    uniformVectorE4(name: string, vector: MutableVectorE4, canvasId: number) {
      return innerProgram.uniformVectorE4(name, vector, canvasId);
    },
    vector2(name: string, data: number[], canvasId: number): void {
      return innerProgram.vector2(name, data, canvasId);
    },
    vector3(name: string, data: number[], canvasId: number): void {
      return innerProgram.vector3(name, data, canvasId);
    },
    vector4(name: string, data: number[], canvasId: number): void {
      return innerProgram.vector4(name, data, canvasId);
    }
  }

  return self;
}

export = smartProgram;