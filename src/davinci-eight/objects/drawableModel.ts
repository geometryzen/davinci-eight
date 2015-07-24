import AttributeMetaInfo = require('../core/AttributeMetaInfo'); 
import AttributeMetaInfos = require('../core/AttributeMetaInfos'); 
import ShaderProgram = require('../programs/ShaderProgram');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import ShaderAttributeLocation = require('../core/ShaderAttributeLocation');
import ShaderUniformLocation = require('../core/ShaderUniformLocation');
import ElementArray = require('../core/ElementArray');
import ChainedUniformProvider = require('../uniforms/ChainedUniformProvider');
import DrawableModel = require('../objects/DrawableModel');
import AttributeProvider = require('../core/AttributeProvider');
import UniformProvider = require('../core/UniformProvider');

var drawableModel = function<MESH extends AttributeProvider, SHADERS extends ShaderProgram, MODEL extends UniformProvider>(mesh: MESH, shaders: SHADERS, model: MODEL): DrawableModel<MESH, SHADERS, MODEL> {
  /**
   * Find an attribute by its code name rather than its semantic role (which is the key in AttributeMetaInfos)
   */
  function findAttributeMetaInfoByVariableName(name: string, attributes: AttributeMetaInfos): AttributeMetaInfo {
    for (var key in attributes) {
      let attribute = attributes[key];
      if (attribute.name === name) {
        return attribute;
      }
    }
  }
  /**
   * Constructs a ShaderAttributeLocation from a declaration.
   */
  function vertexAttrib(declaration: ShaderVariableDecl): ShaderAttributeLocation {
    // Looking up the attribute meta info gives us some early warning if the mesh is deficient.
    let attribute: AttributeMetaInfo = findAttributeMetaInfoByVariableName(declaration.name, mesh.getAttributeMetaInfos());
    if (attribute) {
      return shaders.attributeVariable(declaration.name);
    }
    else {
      throw new Error("The mesh does not support the attribute variable named " + name);
    }
  }
  /**
   * Constructs a ShaderUniformLocation from a declaration.
   */
  function shaderUniformFromDecl(declaration: ShaderVariableDecl): ShaderUniformLocation {
    // By using the ShaderProgram, we get to delegate the management of uniform locations. 
    return shaders.uniformVariable(declaration.name);
  }
  var context: WebGLRenderingContext;
  var contextGainId: string;
  var elements: ElementArray = new ElementArray(mesh);
  var vertexAttributes: ShaderAttributeLocation[] = shaders.attributes.map(vertexAttrib);
  var uniformVariables: ShaderUniformLocation[] = shaders.uniforms.map(shaderUniformFromDecl);

  function updateGeometry() {
    // Make sure to update the mesh first so that the shaders gets the correct data.
    mesh.update(shaders.attributes);
    vertexAttributes.forEach(function(vertexAttribute) {
      vertexAttribute.bufferData(mesh);
    });
    elements.bufferData(mesh);
  }

  var publicAPI = {
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

        // TODO: This should really be consulting a needsUpdate method.
        // We can also put the updates inside the vertexAttribute loop.
        if (!mesh.dynamics()) {
          updateGeometry();
        }
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
    draw(view: UniformProvider) {
      if (shaders.hasContext()) {
        // TODO: This should be a needs update.
        if (mesh.dynamics()) {
          updateGeometry();
        }
        // Update the uniform location values.
        uniformVariables.forEach(function(uniformVariable: ShaderUniformLocation) {
          var chainedProvider = new ChainedUniformProvider(model, view);
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

        vertexAttributes.forEach(function(vertexAttribute: ShaderAttributeLocation) {
          let attribute: AttributeMetaInfo = findAttributeMetaInfoByVariableName(vertexAttribute.name, mesh.getAttributeMetaInfos());
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

  return publicAPI;
};

export = drawableModel;
