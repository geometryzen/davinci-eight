import AttribDataInfo = require('../core/AttribDataInfo'); 
import AttribDataInfos = require('../core/AttribDataInfos'); 
import ShaderProgram = require('../core/ShaderProgram');
import ShaderAttribLocation = require('../core/ShaderAttribLocation');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');
import Primitive = require('../core/Primitive');
import AttribProvider = require('../core/AttribProvider');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import isDefined = require('../checks/isDefined');
import getAttribVarName = require('../core/getAttribVarName');
import getUniformVarName = require('../core/getUniformVarName');
import setAttributes = require('../programs/setAttributes');
import setUniforms = require('../programs/setUniforms');

var primitive = function<MESH extends AttribProvider, MODEL extends UniformProvider>(mesh: MESH, program: ShaderProgram, model: MODEL): Primitive<MESH, MODEL> {

  var $context: WebGLRenderingContext;
  var refCount: number = 0;

  mesh.addRef();
  program.addRef();

  let self = {
    get mesh(): MESH {
      return mesh;
    },
    get program(): ShaderProgram {
      return program;
    },
    get model(): MODEL {
      return model;
    },
    addRef() {
      refCount++;
      // console.log("primitive.addRef() => " + refCount);
    },
    release() {
      refCount--;
      // console.log("primitive.release() => " + refCount);
      if (refCount === 0) {
        mesh.release();
        mesh = void 0;
        program.release();
        program = void 0;
      }
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
    hasContext(): boolean {
      return !!$context;
    },
    /**
     * @method draw
     */
    draw() {
      // TODO: Make this event-driven?
      if (mesh.dynamic) {
        mesh.update();
      }

      program.use();

      program.setUniforms(model.getUniformData());
      program.setAttributes(mesh.getAttribData());

      mesh.draw();

      for (var name in program.attributeLocations) {
        program.attributeLocations[name].disable();
      }
    }
  };

  return self;
};

export = primitive;
