import AttribMetaInfo = require('../core/AttribMetaInfo'); 
import AttribMetaInfos = require('../core/AttribMetaInfos'); 
import ShaderProgram = require('../core/ShaderProgram');
import ShaderAttribLocation = require('../core/ShaderAttribLocation');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');
import ElementArray = require('../core/ElementArray');
import ChainedUniformProvider = require('../uniforms/ChainedUniformProvider');
import Primitive = require('../core/Primitive');
import AttribProvider = require('../core/AttribProvider');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import UniformMetaInfos = require('../core/UniformMetaInfos');
import isDefined = require('../checks/isDefined');
import getAttribVarName = require('../core/getAttribVarName');
import getUniformVarName = require('../core/getUniformVarName');
import updateUniform = require('../core/updateUniform');
import setAttributes = require('../programs/setAttributes');
import setUniforms = require('../programs/setUniforms');

var primitive = function<MESH extends AttribProvider, MODEL extends UniformProvider>(mesh: MESH, program: ShaderProgram, model: MODEL): Primitive<MESH, MODEL> {
  /**
   * Find an attribute by its code name rather than its semantic role (which is the key in AttribMetaInfos)
   */
  function findAttribMetaInfoByVariableName(attribVarName: string, attributes: AttribMetaInfos): AttribMetaInfo {
    for (var name in attributes) {
      let attribute = attributes[name];
      if (getAttribVarName(attribute, name) === attribVarName) {
        return attribute;
      }
    }
  }
  var context: WebGLRenderingContext;
  var contextGainId: string;
  var elements: ElementArray = new ElementArray(mesh);

  var self = {
    get mesh(): MESH {
      return mesh;
    },
    get program(): ShaderProgram {
      return program;
    },
    get model(): MODEL {
      return model;
    },
    contextFree() {
      program.contextFree();
      elements.contextFree();
      context = null;
      contextGainId = null;
    },
    contextGain(contextArg: WebGLRenderingContext, contextId: string) {
      context = contextArg;
      if (contextGainId !== contextId) {
        contextGainId = contextId;
        program.contextGain(context, contextId);
        elements.contextGain(context, contextId);
      }
    },
    contextLoss() {
      program.contextLoss();
      elements.contextLoss();
      context = null;
      contextGainId = null;
    },
    hasContext(): boolean {
      return program.hasContext();
    },
    /**
     * @method draw
     */
    draw() {
      if (!program.hasContext()) {
        return;
      }

      if (mesh.dynamic) {
        mesh.update();
      }

      // NEW attributes
      // No problem here because we loop on keys in buffers.
      let buffers: { [name: string]: WebGLBuffer;} = {}
      let metas: AttribMetaInfos = mesh.getAttribMeta()
      setAttributes(program.attribSetters, buffers, metas);

      // attributes
      let attributeLocations = program.attributeLocations;
      for (var name in attributeLocations) {
        let thing = mesh.getAttribArray(name);
        if (thing) {
          attributeLocations[name].bufferData(thing.data, thing.usage);
        }
        else {
          // We expect this to be detected long before we get here.
          throw new Error("mesh implementation claims to support, but does not provide data for, attribute " + name);
        }
      }
      // elements
      elements.bufferData(mesh);

      setUniforms(program.uniformSetters, model.getUniformData());

      for (var name in attributeLocations) {
        let attribLocation = attributeLocations[name];
        attribLocation.enable();
        let attribute: AttribMetaInfo = findAttribMetaInfoByVariableName(attribLocation.name, mesh.getAttribMeta());
        if (attribute) {
          let size = attribute.size;
          let type = context.FLOAT;//attribute.dataType;
          let normalized = attribute.normalized;
          let stride = attribute.stride;
          let offset = attribute.offset;
          attribLocation.dataFormat(size, type, normalized, stride, offset);
        }
        else {
          throw new Error("The mesh does not support the attribute variable named " + attribLocation.name);
        }
      }

      elements.bind();

      mesh.draw(context);

      for (var name in attributeLocations) {
        let attribLocation = attributeLocations[name];
        attribLocation.disable();
      }
    }
  };

  if (!mesh.dynamic) {
    mesh.update();
  }

  return self;
};

export = primitive;
