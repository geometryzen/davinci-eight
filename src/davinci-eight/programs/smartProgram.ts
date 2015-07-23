import AttributeMetaInfos = require('../core/AttributeMetaInfos');
import shaderProgram = require('./shaderProgram');
import ShaderProgram = require('../programs/ShaderProgram');
import Symbolic = require('../core/Symbolic');
import UniformMetaInfos = require('../core/UniformMetaInfos');

let SPACE = ' ';
let ATTRIBUTE = 'attribute' + SPACE;
let UNIFORM = 'uniform' + SPACE;
let COMMA = ',' + SPACE;
let SEMICOLON = ';';
let LPAREN = '(';
let RPAREN = ')';
let TIMES  = SPACE + '*' + SPACE;
let ASSIGN = SPACE + '=' + SPACE;
/**
 * 
 */
let vertexShader = function(attributes: AttributeMetaInfos, uniforms: UniformMetaInfos): string {

  var lines: string[] = [];
  for (name in attributes) {
    lines.push(ATTRIBUTE + attributes[name].glslType + SPACE + attributes[name].name + SEMICOLON);
  }
  for (name in uniforms) {
    lines.push(UNIFORM + uniforms[name].glslType + SPACE + uniforms[name].name + SEMICOLON);
  }
  if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
    lines.push("varying highp vec4 vColor;");
  }
  lines.push("varying highp vec3 vLight;");
  lines.push("void main(void) {");
  let glPosition: string[] = [];
  glPosition.unshift(SEMICOLON);
  glPosition.unshift(RPAREN);
  glPosition.unshift("1.0");
  glPosition.unshift(COMMA);
  glPosition.unshift(attributes[Symbolic.ATTRIBUTE_POSITION].name);
  glPosition.unshift(LPAREN);
  glPosition.unshift("vec4");
  if (uniforms[Symbolic.UNIFORM_MODEL_MATRIX]) {
    glPosition.unshift(TIMES);
    glPosition.unshift(uniforms[Symbolic.UNIFORM_MODEL_MATRIX].name);
  }
  if (uniforms[Symbolic.UNIFORM_VIEW_MATRIX]) {
    glPosition.unshift(TIMES);
    glPosition.unshift(uniforms[Symbolic.UNIFORM_VIEW_MATRIX].name);
  }
  if (uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX]) {
    glPosition.unshift(TIMES);
    glPosition.unshift(uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX].name);
  }
  glPosition.unshift(ASSIGN);
  glPosition.unshift("gl_Position");
  lines.push(glPosition.join(''));

  if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
    switch(attributes[Symbolic.ATTRIBUTE_COLOR].glslType)
    {
      case 'vec4':
      {
        lines.push("  vColor = " + attributes[Symbolic.ATTRIBUTE_COLOR].name + SEMICOLON);
      }
      break;
      case 'vec3':
      {
        lines.push("  vColor = vec4(" + attributes[Symbolic.ATTRIBUTE_COLOR].name + ", 1.0);");
      }
      break;
      default:
      {
        throw new Error("Unexpected type for color attribute: " + attributes[Symbolic.ATTRIBUTE_COLOR].glslType);
      }
    }
  }

  if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
    lines.push("  vec3 ambientLight = " + uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT].name + SEMICOLON);
  }
  if (uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] && attributes[Symbolic.ATTRIBUTE_NORMAL]) {
    lines.push("  vec3 diffuseLightColor = vec3(0.8, 0.8, 0.8);");
    lines.push("  vec3 L = normalize(vec3(8.0, 10.0, 5.0));");
    lines.push("  vec3 N = normalize(" + uniforms[Symbolic.UNIFORM_NORMAL_MATRIX].name + " * " + attributes[Symbolic.ATTRIBUTE_NORMAL].name + ");");
    lines.push("  float diffuseLightAmount = max(dot(N, L), 0.0);");
    if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
      lines.push("  vLight = ambientLight + diffuseLightAmount * diffuseLightColor;");
    }
    else {
      lines.push("  vLight = diffuseLightAmount * diffuseLightColor;");
    }
  }
  else {
    if (uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT]) {
      lines.push("  vLight = ambientLight;");
    }
    else {
      lines.push("  vLight = vec3(1.0, 1.0, 1.0);");
    }
  }
  lines.push("  gl_PointSize = 6.0;");
  lines.push("}");

  let code = lines.join("\n");
  return code;
}
/**
 *
 */
let fragmentShader = function(attributes: AttributeMetaInfos, uniforms: UniformMetaInfos) {

  var lines: string[] = [];
  if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
    lines.push("varying highp vec4 vColor;");
  }
  lines.push("varying highp vec3 vLight;");
  lines.push("void main(void) {");
  if (attributes[Symbolic.ATTRIBUTE_COLOR]) {
    lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
  }
  else {
    lines.push("  gl_FragColor = vec4(vLight, 1.0);");
  }
  lines.push("}");
  var code = lines.join("\n");
  return code;
}
/**
 *
 */
var smartProgram = function(attributes: AttributeMetaInfos, uniformsList: UniformMetaInfos[]): ShaderProgram {

  if (attributes) {

  }
  else {
    throw new Error("The attributes parameter is required for smartProgram.");
  }

  if (uniformsList) {

  }
  else {
    throw new Error("The uniforms parameter is required for smartProgram.");
  }

  var uniforms: UniformMetaInfos = {};
  uniformsList.forEach(function(uniformsElement) {
    for (var name in uniformsElement) {
      uniforms[name] = uniformsElement[name];
    }
  });

  let innerProgram: ShaderProgram = shaderProgram(vertexShader(attributes, uniforms), fragmentShader(attributes, uniforms));

  let publicAPI: ShaderProgram = {
    get attributes() {
      return innerProgram.attributes;
    },
    get uniforms() {
      return innerProgram.uniforms;
    },
    get varyings() {
      return innerProgram.varyings;
    },
    get program() {
      return innerProgram.program;
    },
    get programId() {
      return innerProgram.programId;
    },
    get vertexShader() {
      return innerProgram.vertexShader;
    },
    get fragmentShader() {
      return innerProgram.fragmentShader;
    },
    contextFree() {
      return innerProgram.contextFree();
    },
    contextGain(context: WebGLRenderingContext, contextGainId: string) {
      return innerProgram.contextGain(context, contextGainId);
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
    attributeVariable(name: string) {
      return innerProgram.attributeVariable(name);
    },
    uniformVariable(name: string) {
      return innerProgram.uniformVariable(name);
    }
  }

  return publicAPI;
}

export = smartProgram;