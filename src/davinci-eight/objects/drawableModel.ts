import AttributeMetaInfo = require('../core/AttributeMetaInfo'); 
import AttributeMetaInfos = require('../core/AttributeMetaInfos'); 
import ShaderProgram = require('../programs/ShaderProgram');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
import ShaderAttributeVariable = require('../core/ShaderAttributeVariable');
import ShaderUniformVariable = require('../core/ShaderUniformVariable');
import ElementArray = require('../core/ElementArray');
import ChainedVertexUniformProvider = require('./ChainedVertexUniformProvider');
import DrawableModel = require('../objects/DrawableModel');
import Vector3 = require('../math/Vector3');
import VertexAttributeProvider = require('../core/VertexAttributeProvider');
import VertexUniformProvider = require('../core/VertexUniformProvider');

var drawableModel = function<G extends VertexAttributeProvider, M extends VertexUniformProvider, P extends ShaderProgram>(mesh: G, model: M, shaderProgram: P): DrawableModel<G, M, P> {
  /**
   * Find an attribute by its code name rather than its semantic role (which is the key in AttributeMetaInfos)
   */
  function findAttributeByVariableName(name: string, attributes: AttributeMetaInfos): AttributeMetaInfo {
    for (var key in attributes) {
      let attribute = attributes[key];
      if (attribute.name === name) {
        return attribute;
      }
    }
  }
  /**
   * Constructs a ShaderAttributeVariable from a declaration.
   */
  function vertexAttrib(declaration: ShaderVariableDecl): ShaderAttributeVariable {
    let name = declaration.name;
    let attribute: AttributeMetaInfo = findAttributeByVariableName(name, mesh.getAttributeMetaInfos());
    if (attribute) {
      let size = attribute.size;
      let normalized = attribute.normalized;
      let stride = attribute.stride;
      let offset = attribute.offset;
      // TODO: Maybe type should be passed along?
      return new ShaderAttributeVariable(name, size, normalized, stride, offset);
    }
    else {
      throw new Error("The geometry does not support the attribute variable named " + name);
    }
  }
  /**
   * Constructs a ShaderUniformVariable from a declaration.
   */
  function shaderUniformFromDecl(declaration: ShaderVariableDecl): ShaderUniformVariable {
    var modifiers = declaration.modifiers;
    var type = declaration.type;
    var name = declaration.name;
    return new ShaderUniformVariable(name, type);
  }
  var context: WebGLRenderingContext;
  var contextGainId: string;
  var elements: ElementArray = new ElementArray(mesh);
  var vertexAttributes: ShaderAttributeVariable[] = shaderProgram.attributes.map(vertexAttrib);
  var uniformVariables: ShaderUniformVariable[] = shaderProgram.uniforms.map(shaderUniformFromDecl);

  function updateGeometry() {
    // Make sure to update the mesh first so that the shaderProgram gets the correct data.
    mesh.update(shaderProgram.attributes);
    vertexAttributes.forEach(function(vertexAttribute) {
      vertexAttribute.bufferData(mesh);
    });
    elements.bufferData(mesh);
  }

  var publicAPI = {
    get mesh(): G {
      return mesh;
    },
    get shaderProgram(): P {
      return shaderProgram;
    },
    get model(): M {
      return model;
    },
    contextFree() {
      shaderProgram.contextFree();
      vertexAttributes.forEach(function(vertexAttribute) {
        vertexAttribute.contextFree();
      });
      elements.contextFree();
      context = null;
      contextGainId = null;
    },
    contextGain(contextArg: WebGLRenderingContext, contextId: string) {
      context = contextArg;
      if (contextGainId !== contextId) {
        contextGainId = contextId;
        shaderProgram.contextGain(context, contextId);

        // Cache the attribute variable locations.
        vertexAttributes.forEach(function(vertexAttribute) {
          vertexAttribute.contextGain(context, shaderProgram.program);
        });

        elements.contextGain(context);

        // TODO: This should really be consulting a needsUpdate method.
        // We can also put the updates inside the vertexAttribute loop.
        if (!mesh.dynamics()) {
          updateGeometry();
        }

        // Cache the uniform variable locations.
        uniformVariables.forEach(function(uniformVariable) {
          uniformVariable.contextGain(context, shaderProgram.program);
        }); 
      }
    },
    contextLoss() {
      shaderProgram.contextLoss();
      vertexAttributes.forEach(function(vertexAttribute) {
        vertexAttribute.contextLoss();
      });
      elements.contextLoss();
      context = null;
      contextGainId = null;
    },
    hasContext(): boolean {
      return shaderProgram.hasContext();
    },
    get drawGroupName(): string {return shaderProgram.programId;},
    useProgram() {
      context.useProgram(shaderProgram.program);
    },
    draw(view: VertexUniformProvider) {
      if (shaderProgram.hasContext()) {
        // TODO: This should be a needs update.
        if (mesh.dynamics()) {
          updateGeometry();
        }
        // Update the uniform location values.
        uniformVariables.forEach(function(uniformVariable: ShaderUniformVariable) {
          var chainedProvider = new ChainedVertexUniformProvider(model, view);
          switch(uniformVariable.type) {
            case 'vec3': {
              var vector: Vector3 = chainedProvider.getUniformVector3(uniformVariable.name);
              if (vector) {
                uniformVariable.vec3([vector.x, vector.y, vector.z]);
              }
              else {
                throw new Error("Expecting data for uniform " + uniformVariable.name);
              }
            }
            break;
            case 'mat3': {
              var m3data = chainedProvider.getUniformMatrix3(uniformVariable.name);
              if (m3data) {
                uniformVariable.mat3(m3data.transpose, m3data.matrix3);
              }
              else {
                throw new Error("Expecting data for uniform " + uniformVariable.name);
              }
            }
            break;
            case 'mat4': {
              var m4data = chainedProvider.getUniformMatrix4(uniformVariable.name);
              if (m4data) {
                uniformVariable.mat4(m4data.transpose, m4data.matrix4);
              }
              else {
                throw new Error("Expecting data for uniform " + uniformVariable.name);
              }
            }
            break;
            default: {
              throw new Error("uniform type => " + uniformVariable.type);
            }
          }
        }); 

        vertexAttributes.forEach(function(vertexAttribute) {
          vertexAttribute.enable();
        });

        vertexAttributes.forEach(function(vertexAttribute) {
          vertexAttribute.bind();
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
