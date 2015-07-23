import ShaderProgram = require('../programs/ShaderProgram');
import AttributeProvider = require('../core/AttributeProvider');
import parse = require('../glsl/parse');
import NodeWalker = require('../glsl/NodeWalker');
import ProgramArgs = require('../glsl/ProgramArgs');
import Declaration = require('../glsl/Declaration');
import DebugNodeEventHandler = require('../glsl/DebugNodeEventHandler');
import DefaultNodeEventHandler = require('../glsl/DefaultNodeEventHandler');
import uuid4 = require('../utils/uuid4');
import ShaderAttributeVariable = require('../core/ShaderAttributeVariable');
import ShaderUniformVariable = require('../core/ShaderUniformVariable');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');

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

  var attributeDecls: ShaderVariableDecl[] = [];
  var uniformDecls:   ShaderVariableDecl[] = [];
  var varyingDecls:   ShaderVariableDecl[] = [];

  var attributeLocations: { [name: string]: ShaderAttributeVariable } = {};
  var uniformLocations: { [name: string]: ShaderUniformVariable } = {};

  var publicAPI: ShaderProgram = {
    get vertexShader() {
      return vertexShader;
    },
    set vertexShader(value: string) {
      try {
        let program = parse(value);
        vertexShader = value;
        let walker = new NodeWalker();
        let args = new ProgramArgs();
        walker.walk(program, args);
        attributeDecls = args.attributes.map(function(a) { return {modifiers: a.modifiers, type: a.type, name: a.name }; });
        uniformDecls   = args.uniforms.map(function(u)   { return {modifiers: u.modifiers, type: u.type, name: u.name }; });
        varyingDecls   = args.varyings.map(function(v)   { return {modifiers: v.modifiers, type: v.type, name: v.name }; });
        // TODO: delete existing...
        attributeDecls.forEach(function(attributeDecl) {
          attributeLocations[attributeDecl.name] = new ShaderAttributeVariable(attributeDecl.name, attributeDecl.type);
        });
        uniformDecls.forEach(function(uniformDecl) {
          uniformLocations[uniformDecl.name] = new ShaderUniformVariable(uniformDecl.name, uniformDecl.type);
        });
      }
      catch(e) {
        console.log(e);
      }
    },
    get fragmentShader() {
      return fragmentShader;
    },
    set fragmentShader(value: string) {
      try {
        let fragTree = parse(value);
        fragmentShader = value;
      }
      catch(e) {
        console.log(e);
      }
    },
    get attributes() {
      return attributeDecls;
    },
    get uniforms() {
      return uniformDecls;
    },
    get varyings() {
      return varyingDecls;
    },
    contextFree: function(): void {
      if (program) {
        context.deleteProgram(program);
        program = void 0;
        programId = void 0;
        context = void 0;
        contextGainId = void 0;
        attributeDecls.forEach(function(attributeDecl) {
          attributeLocations[attributeDecl.name].contextFree();
        });
        uniformDecls.forEach(function(uniformDecl) {
          uniformLocations[uniformDecl.name].contextFree();
        });
      }
    },
    contextGain: function(contextArg: WebGLRenderingContext, contextId: string): void {
      context = contextArg;
      if (contextGainId !== contextId) {
        program = makeWebGLProgram(context, vertexShader, fragmentShader);
        programId = uuid4().generate();
        contextGainId = contextId;
        attributeDecls.forEach(function(attributeDecl) {
          attributeLocations[attributeDecl.name].contextGain(contextArg, program);
        });
        uniformDecls.forEach(function(uniformDecl) {
          uniformLocations[uniformDecl.name].contextGain(contextArg, program);
        });
      }
    },
    contextLoss() {
      program = void 0;
      programId = void 0;
      context = void 0;
      contextGainId = void 0;
      attributeDecls.forEach(function(attributeDecl) {
        attributeLocations[attributeDecl.name].contextLoss();
      });
      uniformDecls.forEach(function(uniformDecl) {
        uniformLocations[uniformDecl.name].contextLoss();
      });
    },
    hasContext: function(): boolean {
      return !!program;
    },
    get program() { return program; },
    get programId() {return programId;},
    use() {
      if (context) {
        return context.useProgram(program);
      }
    },
    attributeVariable(name: string) {
      if (attributeLocations[name]) {
        return attributeLocations[name];
      }
      else {
        throw new Error(name + " is not an attribute variable in the shader program.");
      }
    },
    uniformVariable(name: string) {
      if (uniformLocations[name]) {
        return uniformLocations[name];
      }
      else {
        throw new Error(name + " is not a uniform variable in the shader program.");
      }
    }
  };

  // Trigger introspection.
  publicAPI.vertexShader = vertexShader;
  publicAPI.fragmentShader = fragmentShader;

  return publicAPI;
};

/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
function makeWebGLProgram(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string): WebGLProgram {
  // TODO: Proper cleanup if we throw an error at any point.
  var vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vertexShader);
  gl.compileShader(vs);
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vs));
  }
  var fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fragmentShader);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fs));
  }
  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
}

export = shaderProgram;