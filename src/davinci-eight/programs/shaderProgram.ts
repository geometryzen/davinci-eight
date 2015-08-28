import ShaderProgram = require('../core/ShaderProgram');
import AttribProvider = require('../core/AttribProvider');
import parse = require('../glsl/parse');
import NodeWalker = require('../glsl/NodeWalker');
import ProgramArgs = require('../glsl/ProgramArgs');
import Declaration = require('../glsl/Declaration');
import DebugNodeEventHandler = require('../glsl/DebugNodeEventHandler');
import DefaultNodeEventHandler = require('../glsl/DefaultNodeEventHandler');
import uuid4 = require('../utils/uuid4');
import ShaderAttribLocation = require('../core/ShaderAttribLocation');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');

function glslType(type: number, context: WebGLRenderingContext): string {
  switch(type) {
    case 2 : {
      return "foo";
    }
    case context.FLOAT_VEC3: {
      return 'vec3';
    }
    case context.FLOAT_MAT2: {
      return 'mat2';
    }
    case context.FLOAT_MAT3: {
      return 'mat3';
    }
    case context.FLOAT_MAT4: {
      return 'mat4';
    }
    default: {
      throw new Error("Unexpected type: " + type);
    }
  }
}

var shaderProgram = function(vertexShader: string, fragmentShader: string): ShaderProgram {

  if (typeof vertexShader !== 'string') {
    throw new Error("vertexShader argument must be a string.");
  }
  if (typeof fragmentShader !== 'string') {
    throw new Error("fragmentShader argument must be a string.");
  }
  var program: WebGLProgram;
  var programId: string;
  var context: WebGLRenderingContext;
  var contextGainId: string;

  var attributeLocations: { [name: string]: ShaderAttribLocation } = {};
  var uniformLocations: { [name: string]: ShaderUniformLocation } = {};

  var publicAPI: ShaderProgram = {
    get vertexShader() {
      return vertexShader;
    },
    get fragmentShader() {
      return fragmentShader;
    },
    get attributeLocations() {
      return attributeLocations;
    },
    get uniformLocations() {
      return uniformLocations;
    },
    contextFree: function(): void {
      if (program) {
        context.deleteProgram(program);
        program = void 0;
        programId = void 0;
        context = void 0;
        contextGainId = void 0;
        for(var aName in attributeLocations) {
          attributeLocations[aName].contextFree();
        }
        for(var uName in uniformLocations) {
          uniformLocations[uName].contextFree();
        }
      }
    },
    contextGain: function(contextArg: WebGLRenderingContext, contextId: string): void {
      context = contextArg;
      if (contextGainId !== contextId) {
        program = makeWebGLProgram(context, vertexShader, fragmentShader);
        programId = uuid4().generate();
        contextGainId = contextId;
        let activeAttributes: number = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
        for (var a = 0; a < activeAttributes; a++) {
          let activeInfo: WebGLActiveInfo = context.getActiveAttrib(program, a);
          activeInfo.size; // What is this used for?
          activeInfo.type;
          attributeLocations[activeInfo.name] = new ShaderAttribLocation(activeInfo.name, glslType(activeInfo.type, context));
        }
        let activeUniforms: number = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
        for (var u = 0; u < activeUniforms; u++) {
          let activeInfo: WebGLActiveInfo = context.getActiveUniform(program, u);
          uniformLocations[activeInfo.name] = new ShaderUniformLocation(activeInfo.name, glslType(activeInfo.type, context));
        }
        // Broadcast contextGain to attribute and uniform locations.
        for(var aName in attributeLocations) {
          attributeLocations[aName].contextGain(contextArg, program);
        }
        for(var uName in uniformLocations) {
          uniformLocations[uName].contextGain(contextArg, program);
        }
      }
    },
    contextLoss() {
      program = void 0;
      programId = void 0;
      context = void 0;
      contextGainId = void 0;
      for(var aName in attributeLocations) {
        attributeLocations[aName].contextLoss();
      }
      for(var uName in uniformLocations) {
        uniformLocations[uName].contextLoss();
      }
    },
    hasContext: function(): boolean {
      return !!program;
    },
    get program() { return program; },
    get programId() {return programId;},
    use(): ShaderProgram {
      if (context) {
        context.useProgram(program);
      }
      return publicAPI;
    }
  };
  return publicAPI;
};

function makeWebGLShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader {
  var shader: WebGLShader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }
  else {
    let message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("Error compiling shader: " + message);
  }
}

/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
function makeWebGLProgram(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string): WebGLProgram {
  let vs: WebGLShader = makeWebGLShader(gl, vertexShader, gl.VERTEX_SHADER);
  let fs: WebGLShader = makeWebGLShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
  let program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }
  else {
    let message: string = gl.getProgramInfoLog(program);

    gl.detachShader(program, vs);
    gl.deleteShader(vs);

    gl.detachShader(program, fs);
    gl.deleteShader(fs);

    gl.deleteProgram(program);

    throw new Error("Error linking program: " + message);
  }
}

export = shaderProgram;