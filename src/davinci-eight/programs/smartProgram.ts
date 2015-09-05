import AttribDataInfo = require('../core/AttribDataInfo');
import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfo = require('../core/AttribMetaInfo');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import fragmentShader = require('../programs/fragmentShader');
import isDefined = require('../checks/isDefined');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import shaderProgram = require('./shaderProgram');
import ShaderProgram = require('../core/ShaderProgram');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
import vertexShader = require('../programs/vertexShader');

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
    uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1) {
      return innerProgram.uniformMatrix1(name, transpose, matrix);
    },
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2) {
      return innerProgram.uniformMatrix2(name, transpose, matrix);
    },
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3) {
      return innerProgram.uniformMatrix3(name, transpose, matrix);
    },
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4) {
      return innerProgram.uniformMatrix4(name, transpose, matrix);
    },
    uniformVector1(name: string, vector: Vector1) {
      return innerProgram.uniformVector1(name, vector);
    },
    uniformVector2(name: string, vector: Vector2) {
      return innerProgram.uniformVector2(name, vector);
    },
    uniformVector3(name: string, vector: Vector3) {
      return innerProgram.uniformVector3(name, vector);
    },
    uniformVector4(name: string, vector: Vector4) {
      return innerProgram.uniformVector4(name, vector);
    }
  }

  return self;
}

export = smartProgram;