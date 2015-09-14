import AttribProvider = require('../core/AttribProvider');
import DrawableVisitor = require('../core/DrawableVisitor'); 
import isDefined = require('../checks/isDefined');
import Primitive = require('../core/Primitive');
import Program = require('../core/Program');
import UniformData = require('../core/UniformData');

var primitive = function<MESH extends AttribProvider, MODEL extends UniformData>(mesh: MESH, program: Program, model: MODEL): Primitive<MESH, MODEL> {

  var $context: WebGLRenderingContext;
  var refCount: number = 1;

  mesh.addRef();
  program.addRef();

  let self: Primitive<MESH, MODEL> = {
    get mesh(): MESH {
      return mesh;
    },
    get program(): Program {
      return program;
    },
    get model(): MODEL {
      return model;
    },
    addRef(): number {
      refCount++;
      // console.log("primitive.addRef() => " + refCount);
      return refCount;
    },
    release(): number {
      refCount--;
      // console.log("primitive.release() => " + refCount);
      if (refCount === 0) {
        mesh.release();
        mesh = void 0;
        program.release();
        program = void 0;
      }
      return refCount;
    },
    contextFree() {
      if (isDefined($context)) {
        $context = void 0;
        mesh.contextFree();
        program.contextFree();
      }
    },
    contextGain(context: WebGLRenderingContext) {
      if ($context !== context) {
        $context = context;
        mesh.contextGain(context);
        program.contextGain(context);
      }
    },
    contextLoss() {
      if (isDefined($context)) {
        $context = void 0;
        mesh.contextLoss();
        program.contextLoss();
      }
    },
    accept(visitor: DrawableVisitor) {
      visitor.primitive(mesh, program, model);
    }
  };
  return self;
};

export = primitive;
