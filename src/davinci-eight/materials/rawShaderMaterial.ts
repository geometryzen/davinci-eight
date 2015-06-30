/// <reference path="./Material.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
import parse = require('../glsl/parse');
import NodeWalker = require('../glsl/NodeWalker');
import ProgramArgs = require('../glsl/ProgramArgs');
import Declaration = require('../glsl/Declaration');
import DebugNodeEventHandler = require('../glsl/DebugNodeEventHandler');
import DefaultNodeEventHandler = require('../glsl/DefaultNodeEventHandler');

var material = function(vertexShader: string, fragmentShader: string): Material {

  var program: WebGLProgram;
  var programId: string;
  var contextGainId: string;
  var attributes: string[] = [];
  try {
    let program = parse(vertexShader);
    let walker = new NodeWalker();
    let args = new ProgramArgs();
    walker.walk(program, args);
    // TODO: Material should retain/expose all information about shaders, not just name.
    // However, hide the introspection technology API.
    attributes = args.attributes.map(function(attribute) {return attribute.name});
  }
  catch(e) {
    console.log(e);
  }
  try {
    let fragTree = parse(fragmentShader);
  }
  catch(e) {
    console.log(e);
  }

  var publicAPI: Material =
  {
    get attributes(): string[] {
      return attributes;
    },
    contextFree: function(context: WebGLRenderingContext): void {
      if (program) {
        context.deleteProgram(program);
        program = void 0;
        programId = void 0;
        contextGainId = void 0;
      }
    },
    contextGain: function(context: WebGLRenderingContext, contextId: string): void {
      if (contextGainId !== contextId) {
        program = makeProgram(context, vertexShader, fragmentShader);
        programId = uuid4().generate();
        contextGainId = contextId;
      }
    },
    contextLoss() {
      program = void 0;
      programId = void 0;
      contextGainId = void 0;
    },
    hasContext: function(): boolean {
      return !!program;
    },
    get program() { return program; },
    get programId() {return programId;}
  };

  return publicAPI;
};

/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
function makeProgram(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string): WebGLProgram {
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

function uuid4() {
  var maxFromBits = function(bits: number): number {
    return Math.pow(2, bits);
  };

  var limitUI04 = maxFromBits(4);
  var limitUI06 = maxFromBits(6);
  var limitUI08 = maxFromBits(8);
  var limitUI12 = maxFromBits(12);
  var limitUI14 = maxFromBits(14);
  var limitUI16 = maxFromBits(16);
  var limitUI32 = maxFromBits(32);
  var limitUI40 = maxFromBits(40);
  var limitUI48 = maxFromBits(48);

  var getRandomInt = function(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var randomUI06 = function() {
    return getRandomInt(0, limitUI06-1);
  };

  var randomUI08 = function() {
    return getRandomInt(0, limitUI08-1);
  };

  var randomUI12 = function() {
    return getRandomInt(0, limitUI12-1);
  };

  var randomUI16 = function() {
    return getRandomInt(0, limitUI16-1);
  };

  var randomUI32 = function() {
    return getRandomInt(0, limitUI32-1);
  };

  var randomUI48 = function() {
    return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
  };

  var paddedString =  function(str: string, length: number, z?: string) {
    str = String(str);
    z = (!z) ? '0' : z;
    var i = length - str.length;
    for (; i > 0; i >>>= 1, z += z) {
      if (i & 1) {
        str = z + str;
      }
    }
    return str;
  };

  var fromParts = function(timeLow: number, timeMid: number, timeHiAndVersion: number, clockSeqHiAndReserved: number, clockSeqLow: number, node: number) {
    var hex = paddedString(timeLow.toString(16), 8) +
              '-' +
              paddedString(timeMid.toString(16), 4) +
              '-' +
              paddedString(timeHiAndVersion.toString(16), 4) +
              '-' +
              paddedString(clockSeqHiAndReserved.toString(16), 2) +
              paddedString(clockSeqLow.toString(16), 2) +
              '-' +
              paddedString(node.toString(16), 12);
    return hex;
  };

  return {
    generate: function () {
      return fromParts(
        randomUI32(),
        randomUI16(),
        0x4000 | randomUI12(),
        0x80   | randomUI06(),
        randomUI08(),
        randomUI48()
      );
    },

    // addition by Ka-Jan to test for validity
    // Based on: http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
    validate: function (uuid: string) {
      var testPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return testPattern.test(uuid);
    }
  };
}

export = material;