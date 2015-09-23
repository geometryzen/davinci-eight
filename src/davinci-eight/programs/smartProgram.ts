import AttribMetaInfo = require('../core/AttribMetaInfo');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import MonitorList = require('../scene/MonitorList');
import expectArg = require('../checks/expectArg');
import fragmentShader = require('../programs/fragmentShader');
import isDefined = require('../checks/isDefined');
import Matrix1 = require('../math/Matrix1');
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
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
import vertexShader = require('../programs/vertexShader');
import vLightRequired = require('../programs/vLightRequired');

/**
 *
 */
var smartProgram = function(monitors: ContextMonitor[], attributes: { [name: string]: AttribMetaInfo }, uniformsList: { [name: string]: UniformMetaInfo }[], bindings: string[]): IMaterial {
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
    get attributes() {
      return innerProgram.attributes;
    },
    get uniforms() {
      return innerProgram.uniforms;
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
    contextGain(manager: ContextManager) {
      return innerProgram.contextGain(manager);
    },
    contextLoss(canvasId: number) {
      return innerProgram.contextLoss(canvasId);
    },
    use(canvasId: number) {
      return innerProgram.use(canvasId);
    },
    enableAttrib(name: string) {
      return innerProgram.enableAttrib(name);
    },
    disableAttrib(name: string) {
      return innerProgram.disableAttrib(name);
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
    uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1, canvasId: number) {
      return innerProgram.uniformMatrix1(name, transpose, matrix, canvasId);
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
    uniformVector1(name: string, vector: Vector1, canvasId: number) {
      return innerProgram.uniformVector1(name, vector, canvasId);
    },
    uniformVector2(name: string, vector: Vector2, canvasId: number) {
      return innerProgram.uniformVector2(name, vector, canvasId);
    },
    uniformVector3(name: string, vector: Vector3, canvasId: number) {
      return innerProgram.uniformVector3(name, vector, canvasId);
    },
    uniformVector4(name: string, vector: Vector4, canvasId: number) {
      return innerProgram.uniformVector4(name, vector, canvasId);
    }
  }

  return self;
}

export = smartProgram;