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

  let publicAPI: ShaderProgram = {
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
    }
  }

  return publicAPI;
}

export = smartProgram;