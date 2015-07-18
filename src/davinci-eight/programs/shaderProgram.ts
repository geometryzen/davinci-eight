import ShaderProgram = require('../programs/ShaderProgram');
import VertexAttributeProvider = require('../core/VertexAttributeProvider');
import parse = require('../glsl/parse');
import NodeWalker = require('../glsl/NodeWalker');
import ProgramArgs = require('../glsl/ProgramArgs');
import Declaration = require('../glsl/Declaration');
import DebugNodeEventHandler = require('../glsl/DebugNodeEventHandler');
import DefaultNodeEventHandler = require('../glsl/DefaultNodeEventHandler');
import uuid4 = require('../utils/uuid4');

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

  var attributes: {modifiers: string[], type: string, name: string }[] = [];
  var uniforms:   {modifiers: string[], type: string, name: string}[] = [];
  var varyings:   {modifiers: string[], type: string, name: string}[] = [];

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
        attributes = args.attributes.map(function(a) { return {modifiers: a.modifiers, type: a.type, name: a.name }; });
        uniforms   = args.uniforms.map(function(u)   { return {modifiers: u.modifiers, type: u.type, name: u.name }; });
        varyings   = args.varyings.map(function(v)   { return {modifiers: v.modifiers, type: v.type, name: v.name }; });
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
      return attributes;
    },
    get uniforms() {
      return uniforms;
    },
    get varyings() {
      return varyings;
    },
    contextFree: function(): void {
      if (program) {
        context.deleteProgram(program);
        program = void 0;
        programId = void 0;
        context = void 0;
        contextGainId = void 0;
      }
    },
    contextGain: function(contextArg: WebGLRenderingContext, contextId: string): void {
      context = contextArg;
      if (contextGainId !== contextId) {
        program = makeWebGLProgram(context, vertexShader, fragmentShader);
        programId = uuid4().generate();
        contextGainId = contextId;
      }
    },
    contextLoss() {
      program = void 0;
      programId = void 0;
      context = void 0;
      contextGainId = void 0;
    },
    hasContext: function(): boolean {
      return !!program;
    },
    get program() { return program; },
    get programId() {return programId;}
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