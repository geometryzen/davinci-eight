import AttribDataInfo = require('../core/AttribDataInfo');
import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfo = require('../core/AttribMetaInfo');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import shaderProgram = require('./shaderProgram');
import ShaderProgram = require('../core/ShaderProgram');
import Symbolic = require('../core/Symbolic');
import UniformDataInfo = require('../core/UniformDataInfo');
import UniformDataInfos = require('../core/UniformDataInfos');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import isDefined = require('../checks/isDefined');
import vertexShader = require('../programs/vertexShader');
import fragmentShader = require('../programs/fragmentShader');

function vLightRequired(uniforms: UniformMetaInfos): boolean {
  return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
}

function vColorRequired(attributes: AttribMetaInfos, uniforms: UniformMetaInfos): boolean {
  return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
}
/**
 *
 */
var smartProgram = function(attributes: AttribMetaInfos, uniformsList: UniformMetaInfos[]): ShaderProgram {

  if (!isDefined(attributes)) {
    throw new Error("The attributes parameter is required for smartProgram.");
  }

  if (uniformsList) {
  }
  else {
    throw new Error("The uniformsList parameter is required for smartProgram.");
  }

  var uniforms: UniformMetaInfos = {};
  uniformsList.forEach(function(uniformsElement) {
    for (var name in uniformsElement) {
      uniforms[name] = uniformsElement[name];
    }
  });

  let vColor: boolean = vColorRequired(attributes, uniforms);
  let vLight: boolean = vLightRequired(uniforms);

  let innerProgram: ShaderProgram = shaderProgram(vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight));

  let self: ShaderProgram = {
    get program() {
      return innerProgram.program;
    },
    get programId() {
      return innerProgram.programId;
    },
    get attributeLocations() {
      return innerProgram.attributeLocations;
    },
    get uniformLocations() {
      return innerProgram.uniformLocations;
    },
    get uniformSetters() {
      return innerProgram.uniformSetters;
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
    contextFree() {
      return innerProgram.contextFree();
    },
    contextGain(context: WebGLRenderingContext) {
      return innerProgram.contextGain(context);
    },
    contextLoss() {
      return innerProgram.contextLoss();
    },
    hasContext() {
      return innerProgram.hasContext();
    },
    use() {
      return innerProgram.use();
    },
    setAttributes(values: AttribDataInfos) {
      return innerProgram.setAttributes(values);
    },
    setUniforms(values: UniformDataInfos) {
      return innerProgram.setUniforms(values);
    },
    uniform1f(name: string, x: number, picky: boolean) {
      return innerProgram.uniform1f(name, x, picky);
    },
    uniform1fv(name: string, value: number[], picky: boolean) {
      return innerProgram.uniform1fv(name, value, picky);
    },
    uniform2f(name: string, x: number, y: number, picky: boolean) {
      return innerProgram.uniform2f(name, x, y, picky);
    },
    uniform2fv(name: string, value: number[], picky: boolean) {
      return innerProgram.uniform2fv(name, value, picky);
    },
    uniform3f(name: string, x: number, y: number, z: number, picky: boolean) {
      return innerProgram.uniform3f(name, x, y, z, picky);
    },
    uniform3fv(name: string, value: number[], picky: boolean) {
      return innerProgram.uniform3fv(name, value, picky);
    },
    uniform4f(name: string, x: number, y: number, z: number, w: number, picky: boolean) {
      return innerProgram.uniform4f(name, x, y, z, w, picky);
    },
    uniform4fv(name: string, value: number[], picky: boolean) {
      return innerProgram.uniform4fv(name, value, picky);
    },
    uniformMatrix2fv(name: string, transpose: boolean, matrix: Float32Array, picky: boolean) {
      return innerProgram.uniformMatrix2fv(name, transpose, matrix, picky);
    },
    uniformMatrix3fv(name: string, transpose: boolean, matrix: Float32Array, picky: boolean) {
      return innerProgram.uniformMatrix3fv(name, transpose, matrix, picky);
    },
    uniformMatrix4fv(name: string, transpose: boolean, matrix: Float32Array, picky: boolean) {
      return innerProgram.uniformMatrix4fv(name, transpose, matrix, picky);
    }
  }

  return self;
}

export = smartProgram;