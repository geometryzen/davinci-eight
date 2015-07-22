import ShaderProgram = require('../programs/ShaderProgram');
import shaderProgram = require('../programs/shaderProgram');
/**
 * 
 */
let vertexShader = [
  "attribute vec3 aVertexPosition;",
  "attribute vec3 aVertexColor;",
  "",
  "uniform mat4 uMVMatrix;",
  "uniform mat4 uPMatrix;",
  "",
  "varying highp vec4 vColor;",
  "void main(void)",
  "{",
  "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
  "vColor = vec4(aVertexColor, 1.0);",
  "gl_PointSize = 6.0;",
  "}"
].join("\n");
/**
 *
 */
let fragmentShader = [
  "varying highp vec4 vColor;",
  "void main(void)",
  "{",
  "gl_FragColor = vColor;",
  "}"
].join("\n");
/**
 *
 */
var pointsProgram = function() {

  let innerProgram = shaderProgram(vertexShader, fragmentShader);

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
    get vertexShader()
    {
      return innerProgram.vertexShader;
    },
    get fragmentShader()
    {
      return innerProgram.fragmentShader;
    },
    use() {
      return innerProgram.use();
    }
  }

  return publicAPI;
}

export = pointsProgram;