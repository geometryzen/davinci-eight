import AttribLocation = require('../core/AttribLocation');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import IProgram = require('../core/IProgram');
import Matrix1 = require('../math/Matrix1');
import Matrix2 = require('../math/Matrix2');
import Matrix3 = require('../math/Matrix3');
import Matrix4 = require('../math/Matrix4');
import MonitorList = require('../scene/MonitorList');
import NumberIUnknownMap = require('../utils/NumberIUnknownMap');
import expectArg = require('../checks/expectArg');
import uuid4 = require('../utils/uuid4');
import UniformLocation = require('../core/UniformLocation');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');
import Vector4 = require('../math/Vector4');
import refChange = require('../utils/refChange');

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME_IPROGRAM = 'IProgram';

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

// FIXME: Rename to program or createProgram
// FIXME: Handle list of shaders? Else createSimpleProgram

let shaderProgram = function(monitors: ContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]): IProgram {
  MonitorList.verify('monitors', monitors, () => { return "shaderProgram";});
  // FIXME multi-context
  if (typeof vertexShader !== 'string') {
    throw new Error("vertexShader argument must be a string.");
  }

  if (typeof fragmentShader !== 'string') {
    throw new Error("fragmentShader argument must be a string.");
  }

  var refCount: number = 1;
  /**
   * Because we are multi-canvas aware, programs are tracked by the canvas id.
   */
  var programs: { [id: number]: WebGLProgram } = {};
  /**
   * Because we are multi-canvas aware, gls are tracked by the canvas id.
   * We need to hold onto a WebGLRenderingContext so that we can delete programs.
   */
  var gls: { [id: number]: WebGLRenderingContext } = {};

  let uuid: string = uuid4().generate();
  // This looks wrong.
  var attributeLocations: { [name: string]: AttribLocation } = {};
  var uniformLocations: { [name: string]: UniformLocation } = {};

  var self: IProgram = {
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
      refChange(uuid, LOGGING_NAME_IPROGRAM, +1);
      refCount++;
      return refCount;
    },
    release(): number {
      refChange(uuid, LOGGING_NAME_IPROGRAM, -1);
      refCount--;
      if (refCount === 0) {
        MonitorList.removeContextListener(self, monitors);
        let keys: number[] = Object.keys(gls).map(function(key: string) {return parseInt(key)});
        let keysLength = keys.length;
        for (var k = 0; k < keysLength; k++) {
          let canvasId = keys[k];
          self.contextFree(canvasId);
        }
      }
      return refCount;
    },
    contextFree(canvasId: number) {
      let $context = gls[canvasId];
      if ($context) {
        let program = programs[canvasId];
        if (program) {
          $context.deleteProgram(program);
          programs[canvasId] = void 0;
        }
        gls[canvasId] = void 0;
        for(var aName in attributeLocations) {
          attributeLocations[aName].contextFree();
        }
        for(var uName in uniformLocations) {
          uniformLocations[uName].contextFree();
        }
      }
    },
    contextGain(manager: ContextManager): void {
      // FIXME: multi-canvas
      let canvasId = manager.canvasId;
      if (gls[canvasId] !== manager.gl) {
        self.contextFree(canvasId);
        gls[canvasId] = manager.gl;
        let context = manager.gl;
        let program: WebGLProgram = makeWebGLProgram(context, vertexShader, fragmentShader, attribs);
        programs[manager.canvasId] = program;
        // FIXME: Need to work with locations by canvasId. 
        let activeAttributes: number = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
        for (var a = 0; a < activeAttributes; a++) {
          let activeAttribInfo: WebGLActiveInfo = context.getActiveAttrib(program, a);
          let name: string = activeAttribInfo.name;
          if (!attributeLocations[name]) {
            attributeLocations[name] = new AttribLocation(manager, name);
          }
        }
        let activeUniforms: number = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
        for (var u = 0; u < activeUniforms; u++) {
          let activeUniformInfo: WebGLActiveInfo = context.getActiveUniform(program, u);
          let name: string = activeUniformInfo.name;
          if (!uniformLocations[name]) {
            uniformLocations[name] = new UniformLocation(manager, name);
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
    contextLoss(canvasId: number) {
      programs[canvasId] = void 0;
      gls[canvasId] = void 0;
      for(var aName in attributeLocations) {
        attributeLocations[aName].contextLoss();
      }
      for(var uName in uniformLocations) {
        uniformLocations[uName].contextLoss();
      }
    },
    // FIXME: Dead code?
    /*
    get program() {
      console.warn("shaderProgram program property is assuming canvas id = 0");
      let canvasId = 0;
      let program: WebGLProgram = programs[canvasId];
      // It's a WebGLProgram, no reference count management required.
      return program;
    },
    */
    get programId() {
      return uuid;
    },
    use(canvasId: number): void {
      let gl = gls[canvasId];
      if (gl) {
        let program: WebGLProgram = programs[canvasId];
        gl.useProgram(program);
      }
      else {
        console.warn(LOGGING_NAME_IPROGRAM + " use(canvasId: number) missing WebGLRenderingContext");
      }
    },
    enableAttrib(name: string) {
      let attribLoc = attributeLocations[name];
      if (attribLoc) {
        attribLoc.enable();
      }
    },
    disableAttrib(name: string) {
      let attribLoc = attributeLocations[name];
      if (attribLoc) {
        attribLoc.disable();
      }
    },
    uniform1f(name: string, x: number, canvasId: number) {
      let uniformLoc = uniformLocations[name];
      if (uniformLoc) {
        // FIXME: What happens to canvasId.
        // Is it used to select the locations? YES?
        // Is it passed on to the location? NO.
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
  MonitorList.addContextListener(self, monitors);
  refChange(uuid, LOGGING_NAME_IPROGRAM, +1);
  return self;
};

export = shaderProgram;