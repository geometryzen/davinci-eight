/// <reference path="./Material.d.ts" />
import material = require('./rawShaderMaterial');
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
var pointsMaterial = function() {
  // The inner object compiles the shaders and introspects them.
  let inner = material(vertexShader, fragmentShader);

  let publicAPI: Material = {
    get attributes() {
      return inner.attributes;
    },
    get uniforms() {
      return inner.uniforms;
    },
    get varyings() {
      return inner.varyings;
    },
    get program() {
      return inner.program;
    },
    get programId() {
      return inner.programId;
    },
    contextFree(context: WebGLRenderingContext) {
      return inner.contextFree(context);
    },
    contextGain(context: WebGLRenderingContext, contextGainId: string) {
      return inner.contextGain(context, contextGainId);
    },
    contextLoss() {
      return inner.contextLoss();
    },
    hasContext() {
      return inner.hasContext();
    }
  }

  return publicAPI;
}

export = pointsMaterial;