import AttribDataInfo = require('../core/AttribDataInfo');
import AttribDataInfos = require('../core/AttribDataInfos');
import AttribProvider = require('../core/AttribProvider');
import ShaderProgram = require('../core/ShaderProgram');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
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
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
import refChange = require('../utils/refChange');

function makeWebGLShader(ctx: WebGLRenderingContext, source: string, type: number): WebGLShader {
  var shader: WebGLShader = ctx.createShader(type);
  ctx.shaderSource(shader, source);
  ctx.compileShader(shader);
  let compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
  if (compiled) {
    return shader;
  }
  else {
    if (!ctx.isContextLost()) {
      let message = ctx.getShaderInfoLog(shader);
      ctx.deleteShader(shader);
      throw new Error("Error compiling shader: " + message);
    }
    else {
      throw new Error("Context lost while compiling shader");
    }
  }
}

/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
function makeWebGLProgram(ctx: WebGLRenderingContext, vertexShader: string, fragmentShader: string, attribs: string[]): WebGLProgram {
  // create our shaders
  let vs: WebGLShader = makeWebGLShader(ctx, vertexShader, ctx.VERTEX_SHADER);
  let fs: WebGLShader = makeWebGLShader(ctx, fragmentShader, ctx.FRAGMENT_SHADER);

  // Create the program object.
  let program = ctx.createProgram();
  // console.log("WebGLProgram created");

  // Attach our two shaders to the program.
  ctx.attachShader(program, vs);
  ctx.attachShader(program, fs);

  // Bind attributes allows us to specify the index that an attribute should be bound to.
  for (var index = 0; index < attribs.length; ++index) {
    ctx.bindAttribLocation(program, index, attribs[index]);
  }

  // Link the program.
  ctx.linkProgram(program);

  // Check the link status
  let linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
  if (linked || ctx.isContextLost()) {
    return program;
  }
  else {
    let message: string = ctx.getProgramInfoLog(program);

    ctx.detachShader(program, vs);
    ctx.deleteShader(vs);

    ctx.detachShader(program, fs);
    ctx.deleteShader(fs);

    ctx.deleteProgram(program);

    throw new Error("Error linking program: " + message);
  }
}

let shaderProgram = function(monitor: RenderingContextMonitor, vertexShader: string, fragmentShader: string, attribs: string[]): ShaderProgram {

  if (typeof vertexShader !== 'string') {
    throw new Error("vertexShader argument must be a string.");
  }

  if (typeof fragmentShader !== 'string') {
    throw new Error("fragmentShader argument must be a string.");
  }

  var refCount: number = 1;
  var program: WebGLProgram;
  var $context: WebGLRenderingContext;
  let uuid: string = uuid4().generate()
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
    addRef(): number {
      refChange(uuid, +1, 'ShaderProgram');
      refCount++;
      return refCount;
    },
    release(): number {
      refChange(uuid, -1, 'ShaderProgram');
      refCount--;
      if (refCount === 0) {
        self.contextFree();
      }
      return refCount;
    },
    contextFree() {
      if (isDefined($context)) {
        if (program) {
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
        program = makeWebGLProgram(context, vertexShader, fragmentShader, attribs);

        let activeAttributes: number = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
        for (var a = 0; a < activeAttributes; a++) {
          let activeAttribInfo: WebGLActiveInfo = context.getActiveAttrib(program, a);
          let name: string = activeAttribInfo.name;
          if (!attributeLocations[name]) {
            attributeLocations[name] = new AttribLocation(monitor, name);
          }
        }
        let activeUniforms: number = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
        for (var u = 0; u < activeUniforms; u++) {
          let activeUniformInfo: WebGLActiveInfo = context.getActiveUniform(program, u);
          let name: string = activeUniformInfo.name;
          if (!uniformLocations[name]) {
            uniformLocations[name] = new UniformLocation(monitor, name);
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
          data.buffer.bind($context.ARRAY_BUFFER);
          attribLoc.vertexPointer(data.size, data.normalized, data.stride, data.offset);
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
  refChange(uuid, +1, 'ShaderProgram');
  return self;
};

export = shaderProgram;