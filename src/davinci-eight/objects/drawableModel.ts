import AttribMetaInfo = require('../core/AttribMetaInfo'); 
import AttribMetaInfos = require('../core/AttribMetaInfos'); 
import ShaderProgram = require('../programs/ShaderProgram');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import ShaderAttribLocation = require('../core/ShaderAttribLocation');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');
import ElementArray = require('../core/ElementArray');
import ChainedUniformProvider = require('../uniforms/ChainedUniformProvider');
import DrawableModel = require('../objects/DrawableModel');
import AttribProvider = require('../core/AttribProvider');
import UniformProvider = require('../core/UniformProvider');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import UniformMetaInfos = require('../core/UniformMetaInfos');

var drawableModel = function<MESH extends AttribProvider, SHADERS extends ShaderProgram, MODEL extends UniformProvider>(
  mesh: MESH,
  shaders: SHADERS,
  model: MODEL): DrawableModel<MESH, SHADERS, MODEL> {
  /**
   * Find an attribute by its code name rather than its semantic role (which is the key in AttribMetaInfos)
   */
  function findAttribMetaInfoByVariableName(name: string, attributes: AttribMetaInfos): AttribMetaInfo {
    for (var key in attributes) {
      let attribute = attributes[key];
      if (attribute.name === name) {
        return attribute;
      }
    }
  }
  /**
   * Constructs a ShaderAttribLocation from a declaration.
   */
  function shaderAttributeLocationFromDecl(declaration: ShaderVariableDecl): ShaderAttribLocation {
    // Looking up the attribute meta info gives us some early warning if the mesh is deficient.
    let attribute: AttribMetaInfo = findAttribMetaInfoByVariableName(declaration.name, mesh.getAttribMeta());
    if (attribute) {
      return shaders.attributeLocation(declaration.name);
    }
    else {
      let message = "The mesh does not support attribute " + declaration.type + " " + declaration.name;
      console.warn(message);
      throw new Error(message);
    }
  }
  /**
   * Constructs a ShaderUniformLocation from a declaration.
   */
  function shaderUniformLocationFromDecl(declaration: ShaderVariableDecl): ShaderUniformLocation {
    // By using the ShaderProgram, we get to delegate the management of uniform locations. 
    return shaders.uniformLocation(declaration.name);
  }

  function checkUniformsCompleteAndReady(provider: UniformProvider) {
    var metas = provider.getUniformMeta();
    shaders.uniforms.forEach(function(uniformDecl: ShaderVariableDecl) {
      var match: UniformMetaInfo = void 0;
      for (var id in metas) {
        let candidate: UniformMetaInfo = metas[id];
        if (candidate.name === uniformDecl.name) {
          match = candidate;
        }
      }
      if (match === void 0) {
        let message = "Missing uniform " + uniformDecl.type + " " + uniformDecl.name;
        console.warn(message);
        throw new Error(message);
      }
      else {
        if (match.glslType !== uniformDecl.type) {
          let message = "Mismatch in uniform types " + uniformDecl.name;
          console.warn(message);
          throw new Error(message);
        }
        else {
          // check that the uniform has been initialized.
        }
      }
    });
  }
  var context: WebGLRenderingContext;
  var contextGainId: string;
  var elements: ElementArray = new ElementArray(mesh);
  var vertexAttributes: ShaderAttribLocation[] = shaders.attributes.map(shaderAttributeLocationFromDecl);
  var uniformVariables: ShaderUniformLocation[] = shaders.uniforms.map(shaderUniformLocationFromDecl);

/*
  function updateGeometry() {
    // Make sure to update the mesh first so that the shaders gets the correct data.
    mesh.update(shaders.attributes);
    vertexAttributes.forEach(function(vertexAttribute: ShaderAttribLocation) {
      let thing = mesh.getAttribArray(vertexAttribute.name);
      if (thing) {
        vertexAttribute.bufferData(thing.data, thing.usage);
      }
      else {
        // We expect this to be detected long before we get here.
        throw new Error("mesh implementation claims to support but does not provide data for attribute " + vertexAttribute.name);
      }
    });
    elements.bufferData(mesh);
  }
*/
  var self = {
    get mesh(): MESH {
      return mesh;
    },
    get shaders(): SHADERS {
      return shaders;
    },
    get model(): MODEL {
      return model;
    },
    contextFree() {
      shaders.contextFree();
      elements.contextFree();
      context = null;
      contextGainId = null;
    },
    contextGain(contextArg: WebGLRenderingContext, contextId: string) {
      context = contextArg;
      if (contextGainId !== contextId) {
        contextGainId = contextId;
        shaders.contextGain(context, contextId);
        elements.contextGain(context, contextId);
      }
    },
    contextLoss() {
      shaders.contextLoss();
      elements.contextLoss();
      context = null;
      contextGainId = null;
    },
    hasContext(): boolean {
      return shaders.hasContext();
    },
    get drawGroupName(): string {return shaders.programId;},
    /**
     * @method useProgram
     */
    useProgram() { return shaders.use(); },
    /**
     * @method draw
     * @param ambients {UniformProvider}
     */
    draw(ambients: UniformProvider) {
      if (shaders.hasContext()) {

        if (mesh.dynamic) {
          mesh.update(shaders.attributes);
        }

        // attributes
        vertexAttributes.forEach(function(vertexAttribute: ShaderAttribLocation) {
          let thing = mesh.getAttribArray(vertexAttribute.name);
          if (thing) {
            vertexAttribute.bufferData(thing.data, thing.usage);
          }
          else {
            // We expect this to be detected long before we get here.
            throw new Error("mesh implementation claims to support but does not provide data for attribute " + vertexAttribute.name);
          }
        });
        // elements
        elements.bufferData(mesh);
        // uniforms
        let chainedProvider = new ChainedUniformProvider(model, ambients);
        checkUniformsCompleteAndReady(chainedProvider);
        // check we have them all.
        // check they are all initialized.
        // Update the uniform location values.
        uniformVariables.forEach(function(uniformVariable: ShaderUniformLocation) {
          switch(uniformVariable.glslType) {
            case 'float': {
              let data: number = chainedProvider.getUniformFloat(uniformVariable.name);
              if (typeof data !== 'undefined') {
                if (typeof data === 'number') {
                  uniformVariable.uniform1f(data);
                }
                else {
                  throw new Error("Expecting typeof data for uniform float " + uniformVariable.name + " to be 'number'.");
                }
              }
              else {
                throw new Error("Expecting data for uniform float " + uniformVariable.name);
              }
            }
            break;
            case 'vec2': {
              let data: number[] = chainedProvider.getUniformVector2(uniformVariable.name);
              if (data) {
                if (data.length === 2) {
                  uniformVariable.uniform2fv(data);
                }
                else {
                  throw new Error("Expecting data for uniform vec2 " + uniformVariable.name + " to be number[] with length 2");
                }
              }
              else {
                throw new Error("Expecting data for uniform vec2 " + uniformVariable.name);
              }
            }
            break;
            case 'vec3': {
              let data: number[] = chainedProvider.getUniformVector3(uniformVariable.name);
              if (data) {
                if (data.length === 3) {
                  uniformVariable.uniform3fv(data);
                }
                else {
                  throw new Error("Expecting data for uniform " + uniformVariable.name + " to be number[] with length 3");
                }
              }
              else {
                throw new Error("Expecting data for uniform " + uniformVariable.name);
              }
            }
            break;
            case 'vec4': {
              let data: number[] = chainedProvider.getUniformVector4(uniformVariable.name);
              if (data) {
                if (data.length === 4) {
                  uniformVariable.uniform4fv(data);
                }
                else {
                  throw new Error("Expecting data for uniform " + uniformVariable.name + " to be number[] with length 4");
                }
              }
              else {
                throw new Error("Expecting data for uniform " + uniformVariable.name);
              }
            }
            break;
            case 'mat3': {
              let data = chainedProvider.getUniformMatrix3(uniformVariable.name);
              if (data) {
                uniformVariable.uniformMatrix3fv(data.transpose, data.matrix3);
              }
              else {
                throw new Error("Expecting data for uniform " + uniformVariable.name);
              }
            }
            break;
            case 'mat4': {
              let data = chainedProvider.getUniformMatrix4(uniformVariable.name);
              if (data) {
                uniformVariable.uniformMatrix4fv(data.transpose, data.matrix4);
              }
              else {
                throw new Error("Expecting data for uniform " + uniformVariable.name);
              }
            }
            break;
            default: {
              throw new Error("Unexpected uniform GLSL type in drawableModel.draw: " + uniformVariable.glslType);
            }
          }
        }); 

        vertexAttributes.forEach(function(vertexAttribute) {
          vertexAttribute.enable();
        });

        vertexAttributes.forEach(function(vertexAttribute: ShaderAttribLocation) {
          let attribute: AttribMetaInfo = findAttribMetaInfoByVariableName(vertexAttribute.name, mesh.getAttribMeta());
          if (attribute) {
            let size = attribute.size;
            let type = context.FLOAT;//attribute.dataType;
            let normalized = attribute.normalized;
            let stride = attribute.stride;
            let offset = attribute.offset;
            vertexAttribute.dataFormat(size, type, normalized, stride, offset);
          }
          else {
            throw new Error("The mesh does not support the attribute variable named " + vertexAttribute.name);
          }
        });

        elements.bind();

        mesh.draw(context);

        vertexAttributes.forEach(function(vertexAttribute) {
          vertexAttribute.disable();
        });
      }
    }
  };

  if (!mesh.dynamic) {
    mesh.update(shaders.attributes);
  }

  return self;
};

export = drawableModel;
