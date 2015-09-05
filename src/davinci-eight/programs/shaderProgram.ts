import AttribDataInfo = require('../core/AttribDataInfo');
import AttribDataInfos = require('../core/AttribDataInfos');
import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import parse = require('../glsl/parse');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import NodeWalker = require('../glsl/NodeWalker');
import ProgramArgs = require('../glsl/ProgramArgs');
import Declaration = require('../glsl/Declaration');
import DebugNodeEventHandler = require('../glsl/DebugNodeEventHandler');
import DefaultNodeEventHandler = require('../glsl/DefaultNodeEventHandler');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
import uuid4 = require('../utils/uuid4');
import AttribLocation = require('../core/AttribLocation');
import UniformLocation = require('../core/UniformLocation');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');

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

  var attributeLocations: { [name: string]: AttribLocation } = {};
  var uniformLocations: { [name: string]: UniformLocation } = {};

  var self: ShaderProgram = {
    get vertexShader() {
      return vertexShader;
    },
    get fragmentShader() {
      return fragmentShader;
    },
    get attributes(): { [name: string]: AttribLocation } {
      return attributeLocations;
    },
    get uniforms(): { [name: string]: UniformLocation } {
      return uniformLocations;
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
            attributeLocations[name] = new AttribLocation(name, activeInfo.size, activeInfo.type);
          }
        }
        let activeUniforms: number = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
        for (var u = 0; u < activeUniforms; u++) {
          let activeInfo: WebGLActiveInfo = context.getActiveUniform(program, u);
          let name: string = activeInfo.name;
          if (!uniformLocations[name]) {
            // TODO: Since name MUST be part of Location, maybe should use an array?
            // TODO: Seems like we should be able to make use of the size and type?
            uniformLocations[name] = new UniformLocation(name);
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
    enableAttrib(name: string) {
      let attribLoc = attributeLocations[name];
      if (attribLoc) {
        attribLoc.enable();
      }
    },
    setAttributes(values: AttribDataInfos) {
      for (var name in attributeLocations) {
        let attribLoc = attributeLocations[name];
        let data: AttribDataInfo = values[name];
        if (data) {
          data.buffer.bind();
          attribLoc.vertexPointer(data.numComponents, data.normalized, data.stride, data.offset);
        }
        else {
          throw new Error("The mesh does not support the attribute variable named " + name);
        }
      }
    },
    uniform1f(name: string, x: number) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.uniform1f(x);
      }
    },
    uniform2f(name: string, x: number, y: number) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.uniform2f(x, y);
      }
    },
    uniform3f(name: string, x: number, y: number, z: number) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.uniform3f(x, y, z);
      }
    },
    uniform4f(name: string, x: number, y: number, z: number, w: number) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.uniform4f(x, y, z, w);
      }
    },
    uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.matrix1(transpose, matrix);
      }
    },
    uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.matrix2(transpose, matrix);
      }
    },
    uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.matrix3(transpose, matrix);
      }
    },
    uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.matrix4(transpose, matrix);
      }
    },
    uniformVector1(name: string, vector: Vector1) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.vector1(vector);
      }
    },
    uniformVector2(name: string, vector: Vector2) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.vector2(vector);
      }
    },
    uniformVector3(name: string, vector: Vector3) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.vector3(vector);
      }
    },
    uniformVector4(name: string, vector: Vector4) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        uniformLoc.vector4(vector);
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