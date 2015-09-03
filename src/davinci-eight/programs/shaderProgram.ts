import AttribDataInfo = require('../core/AttribDataInfo');
import AttribDataInfos = require('../core/AttribDataInfos');
import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import ShaderAttribSetter   = require('../core/ShaderAttribSetter');
import parse = require('../glsl/parse');
import NodeWalker = require('../glsl/NodeWalker');
import ProgramArgs = require('../glsl/ProgramArgs');
import Declaration = require('../glsl/Declaration');
import DebugNodeEventHandler = require('../glsl/DebugNodeEventHandler');
import DefaultNodeEventHandler = require('../glsl/DefaultNodeEventHandler');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import uuid4 = require('../utils/uuid4');
import ShaderAttribLocation = require('../core/ShaderAttribLocation');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');
import ShaderUniformSetter   = require('../core/ShaderUniformSetter');
import createUniformSetters = require('../programs/createUniformSetters');
import setUniforms = require('../programs/setUniforms');
import UniformDataInfo = require('../core/UniformDataInfo');
import UniformDataInfos = require('../core/UniformDataInfos');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import UniformMetaInfos = require('../core/UniformMetaInfos');

var shaderProgram = function(vertexShader: string, fragmentShader: string, uuid: string = uuid4().generate()): ShaderProgram {

  if (typeof vertexShader !== 'string') {
    throw new Error("vertexShader argument must be a string.");
  }

  if (typeof fragmentShader !== 'string') {
    throw new Error("fragmentShader argument must be a string.");
  }

  var refCount: number = 0;
  var program: WebGLProgram;
  var $context: WebGLRenderingContext;

  var attributeLocations: { [name: string]: ShaderAttribLocation } = {};
  var uniformLocations: { [name: string]: ShaderUniformLocation } = {};
  var uniformSetters: {[name: string]: ShaderUniformSetter} = {};

  var self: ShaderProgram = {
    get vertexShader() {
      return vertexShader;
    },
    get fragmentShader() {
      return fragmentShader;
    },
    get attributeLocations(): { [name: string]: ShaderAttribLocation } {
      return attributeLocations;
    },
    get uniformLocations(): { [name: string]: ShaderUniformLocation } {
      return uniformLocations;
    },
    get uniformSetters(): {[name: string]: ShaderUniformSetter} {
      return uniformSetters;
    },
    addRef(): void {
      refCount++;
      // console.log("shaderProgram.addRef() => " + refCount);
    },
    release(): void {
      refCount--;
      // console.log("shaderProgram.release() => " + refCount);
      if (refCount === 0) {
        self.contextFree();
      }
    },
    contextFree() {
      if (isDefined($context)) {
        if (program) {
          // console.log("WebGLProgram deleted");
          $context.deleteProgram(program);
          program = void 0;
        }
        $context = void 0;
        for(var aName in attributeLocations) {
          attributeLocations[aName].contextFree();
        }
        for(var uName in uniformLocations) {
          uniformLocations[uName].contextFree();
        }
      }
    },
    contextGain(context: WebGLRenderingContext): void {
      if ($context !== context) {
        self.contextFree();
        $context = context;
        program = makeWebGLProgram(context, vertexShader, fragmentShader);

        let activeAttributes: number = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
        for (var a = 0; a < activeAttributes; a++) {
          let activeInfo: WebGLActiveInfo = context.getActiveAttrib(program, a);
          let name: string = activeInfo.name;
          // The following properties don't correspond directly wuth those used.
          // If the attribute or uniform is an array, this will be the number of elements in the array. Otherwise, this will be 1.
          let size: number = activeInfo.size;
          let type: number = activeInfo.type;
          if (!attributeLocations[name]) {
            // TODO: Since name MUST be part of Location, maybe should use an array?
            attributeLocations[name] = new ShaderAttribLocation(name, activeInfo.size, activeInfo.type);
          }
        }
        let activeUniforms: number = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
        for (var u = 0; u < activeUniforms; u++) {
          let activeInfo: WebGLActiveInfo = context.getActiveUniform(program, u);
          let name: string = activeInfo.name;
          if (!uniformLocations[name]) {
            // TODO: Seems like we should be able to make use of the size and type?
            uniformLocations[name] = new ShaderUniformLocation(name);
            // TODO: Seems like create setter S/B redundant.
            uniformSetters[name] = uniformLocations[name].createSetter(context, activeInfo);
          }
        }
        for(var aName in attributeLocations) {
          attributeLocations[aName].contextGain(context, program);
        }
        for(var uName in uniformLocations) {
          uniformLocations[uName].contextGain(context, program);
        }
      }
    },
    contextLoss() {
      program = void 0;
      $context = void 0;
      for(var aName in attributeLocations) {
        attributeLocations[aName].contextLoss();
      }
      for(var uName in uniformLocations) {
        uniformLocations[uName].contextLoss();
      }
    },
    hasContext: function(): boolean {
      return !!$context;
    },
    get program() { return program; },
    get programId() {return uuid;},
    use(): ShaderProgram {
      if ($context) {
        $context.useProgram(program);
      }
      else {
        console.warn("shaderProgram.use() missing WebGLRenderingContext");
      }
      return self;
    },
    setAttributes(values: AttribDataInfos) {
      for (var name in attributeLocations) {
        let slot = attributeLocations[name];
        let data: AttribDataInfo = values[slot.name];
        if (data) {
          data.buffer.bindBuffer();
          slot.enable();
          slot.vertexAttribPointer(data.numComponents, data.normalized, data.stride, data.offset);
        }
        else {
          throw new Error("The mesh does not support the attribute variable named " + slot.name);
        }
      }
    },
    setUniforms(values: UniformDataInfos) {
      setUniforms(uniformSetters, values);
    },
    setUniform3fv(name: string, value: number[]) {
      // TODO: Unwrap and make more efficient.
      // TODO: Eliminate setters.
      expectArg('name', name).toBeString();
      let values: UniformDataInfos = {};
      let data: UniformDataInfo = {};
      data.vector = value;
      values[name] = data;
      setUniforms(uniformSetters, values);
    },
    setUniformMatrix4fv(name: string, matrix: Float32Array, transpose: boolean = false) {
      expectArg('name', name).toBeString();
      var uniformLocation = uniformLocations[name];
      if (uniformLocation) {
        uniformLocation.uniformMatrix4fv(transpose, matrix);
      }
      else {
        // Ignore the fact that the program does not contain the active uniform.
      }
    }
  };
  return self;
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
  // console.log("WebGLProgram created");
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
    // console.log("WebGLProgram deleted");

    throw new Error("Error linking program: " + message);
  }
}

export = shaderProgram;