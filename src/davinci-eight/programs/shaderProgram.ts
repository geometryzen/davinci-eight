import ShaderProgram = require('../programs/ShaderProgram');
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
import ShaderVariableDecl = require('../core/ShaderVariableDecl');

function glslType(type: number): string {
  switch(type) {
    case 2 : {
      return "foo";
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
  function analyze() {
    // TODO: uniform with same name in both files.
    // TODO: varying correlation.
    function shaderVariable(d: Declaration): ShaderVariableDecl {
      return { modifiers: d.modifiers, type: d.type, name: d.name };
    }
    function analyzeVertexShader() {
      try {
        let vsTree = parse(vertexShader);
        let walker = new NodeWalker();
        let args = new ProgramArgs();
        walker.walk(vsTree, args);
        // attributes
        args.attributes.forEach(function(a: Declaration) {
          let attributeDecl = shaderVariable(a);
          attributeDecls.push(attributeDecl);
          attributeLocations[attributeDecl.name] = new ShaderAttribLocation(attributeDecl.name, attributeDecl.type);
        });
        // uniforms
        args.uniforms.forEach(function(u: Declaration) {
          let uniformDecl = shaderVariable(u);
          uniformDecls.push(uniformDecl);
          uniformLocations[uniformDecl.name] = new ShaderUniformLocation(uniformDecl.name, uniformDecl.type);
        });
        // varyings
        args.varyings.forEach(function(v: Declaration) {
          let varyingDecl = shaderVariable(v);
          varyingDecls.push(varyingDecl);
        });
      }
      catch(e) {
        console.log(e);
      }
    }
    function analyzeFragmentShader() {
      try {
        let fsTree = parse(fragmentShader);
        let walker = new NodeWalker();
        let args = new ProgramArgs();
        walker.walk(fsTree, args);
        // attributes
        // uniforms
        args.uniforms.forEach(function(u: Declaration) {
          let uniformDecl = shaderVariable(u);
          uniformDecls.push(uniformDecl);
          uniformLocations[uniformDecl.name] = new ShaderUniformLocation(uniformDecl.name, uniformDecl.type);
        });
        // varyings
      }
      catch(e) {
        console.log(e);
      }
    }

    analyzeVertexShader();
    analyzeFragmentShader();
  }

  var program: WebGLProgram;
  var programId: string;
  var context: WebGLRenderingContext;
  var contextGainId: string;

  var attributeDecls: ShaderVariableDecl[] = [];
  var constantDecls:  ShaderVariableDecl[] = [];
  var uniformDecls:   ShaderVariableDecl[] = [];
  var varyingDecls:   ShaderVariableDecl[] = [];

  var attributeLocations: { [name: string]: ShaderAttribLocation } = {};
  var uniformLocations: { [name: string]: ShaderUniformLocation } = {};

  var publicAPI: ShaderProgram = {
    get vertexShader() {
      return vertexShader;
    },
    get fragmentShader() {
      return fragmentShader;
    },
    get attributes() {
      return attributeDecls;
    },
    get constants() {
      return constantDecls;
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
        /*
        let activeAttributes: number = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
        for (var a = 0; a < activeAttributes; a++) {
          let activeInfo: WebGLActiveInfo = context.getActiveAttrib(program, a);
        }
        let activeUniforms: number = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
        for (var u = 0; u < activeUniforms; u++) {
          let activeInfo: WebGLActiveInfo = context.getActiveUniform(program, u);
        }
        */
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
    use() {
      if (context) {
        return context.useProgram(program);
      }
    },
    attributeLocation(name: string) {
      if (attributeLocations[name]) {
        return attributeLocations[name];
      }
      else {
        throw new Error(name + " is not an attribute variable in the shader program.");
      }
    },
    uniformLocation(name: string) {
      if (uniformLocations[name]) {
        return uniformLocations[name];
      }
      else {
        throw new Error(name + " is not a uniform variable in the shader program.");
      }
    }
  };

  analyze();

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