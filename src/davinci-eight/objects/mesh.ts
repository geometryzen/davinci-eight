/// <reference path="../geometries/VertexAttributeProvider.d.ts" />
/// <reference path="../materials/Material.d.ts" />
/// <reference path="../renderers/VertexUniformProvider.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import ShaderAttributeVariable = require('./ShaderAttributeVariable');
import object3D = require('davinci-eight/core/object3D');
import vs_source = require('davinci-eight/shaders/shader-vs');
import fs_source = require('davinci-eight/shaders/shader-fs');
import glMatrix = require('gl-matrix');
import ElementArray = require('davinci-eight/objects/ElementArray');
import ShaderUniformVariable = require('davinci-eight/objects/ShaderUniformVariable');
import ChainedVertexUniformProvider = require('./ChainedVertexUniformProvider');
import FactoredDrawable = require('../objects/FactoredDrawable');

var mesh = function<G extends VertexAttributeProvider, M extends Material>(
  geometry: G,
  material: M,
  meshUniforms: VertexUniformProvider): FactoredDrawable<G, M> {
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
  function vertexAttrib(declaration: {modifiers: string[], type: string, name: string}): ShaderAttributeVariable {
    let name = declaration.name;
    let attribute: AttributeMetaInfo = findAttributeByVariableName(name, geometry.getAttributeMetaInfos());
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
  function shaderUniformFromDecl(declaration: {modifiers: string[], type: string, name: string}): ShaderUniformVariable {
    var modifiers = declaration.modifiers;
    var type = declaration.type;
    var name = declaration.name;
    return new ShaderUniformVariable(name, type);
  }

  var base = object3D();
  var contextGainId: string;
  var elements = new ElementArray(geometry);
  var vertexAttributes: ShaderAttributeVariable[] = material.attributes.map(vertexAttrib);
  var uniformVariables: ShaderUniformVariable[] = material.uniforms.map(shaderUniformFromDecl);
  if (uniformVariables.length > 0) {
    if (typeof meshUniforms === 'undefined') {
      throw new Error('meshUniforms argument must be supplied for shader uniform variables.');
    }
    else {
      if (typeof meshUniforms !== 'object') {
        throw new Error('meshUniforms must be an object.');
      }
    }
  }

  function updateGeometry(context: WebGLRenderingContext, time: number) {
    // Make sure to update the geometry first so that the material gets the correct data.
    geometry.update(time, material.attributes);
    vertexAttributes.forEach(function(vertexAttribute) {
      vertexAttribute.bufferData(context, geometry);
    });
    elements.bufferData(context, geometry);
  }

  var publicAPI = {
    get geometry(): G {
      return geometry;
    },
    get material(): M {
      return material;
    },
    contextFree(context: WebGLRenderingContext) {
      material.contextFree(context);
      vertexAttributes.forEach(function(vertexAttribute) {
        vertexAttribute.contextFree(context);
      });
      elements.contextFree(context);
    },
    contextGain(context: WebGLRenderingContext, contextId: string) {
      if (contextGainId !== contextId) {
        contextGainId = contextId;
        material.contextGain(context, contextId);

        // Cache the attribute variable locations.
        vertexAttributes.forEach(function(vertexAttribute) {
          vertexAttribute.contextGain(context, material.program);
        });

        elements.contextGain(context);

        // TODO: This should really be consulting a needsUpdate method.
        // We can also put the updates inside the vertexAttribute loop.
        if (!geometry.dynamics()) {
          updateGeometry(context, 0);
        }

        // Cache the uniform variable locations.
        uniformVariables.forEach(function(uniformVariable) {
          uniformVariable.contextGain(context, material.program);
        }); 
      }
    },
    contextLoss() {
      material.contextLoss();
      vertexAttributes.forEach(function(vertexAttribute) {
        vertexAttribute.contextLoss();
      });
      elements.contextLoss();
    },
    hasContext(): boolean {
      return material.hasContext();
    },
    get drawGroupName(): string {return material.programId;},
    useProgram(context: WebGLRenderingContext) {
      context.useProgram(material.program);
    },
    draw(context: WebGLRenderingContext, time: number, ambientUniforms: VertexUniformProvider) {
      if (material.hasContext()) {
        // TODO: This should be a needs update.
        if (geometry.dynamics()) {
          updateGeometry(context, time);
        }
        // Update the uniform location values.
        uniformVariables.forEach(function(uniformVariable: ShaderUniformVariable) {
          if (meshUniforms) {
            var chainedProvider = new ChainedVertexUniformProvider(meshUniforms, ambientUniforms);
            switch(uniformVariable.type) {
              case 'mat3': {
                var m3data = chainedProvider.getUniformMatrix3(uniformVariable.name);
                if (m3data) {
                  uniformVariable.matrix(context, m3data.transpose, m3data.matrix3);
                }
                else {
                  throw new Error("Expecting data from mesh callback for uniform " + uniformVariable.name);
                }
              }
              break;
              case 'mat4': {
                var m4data = chainedProvider.getUniformMatrix4(uniformVariable.name);
                if (m4data) {
                  uniformVariable.matrix(context, m4data.transpose, m4data.matrix4);
                }
                else {
                  throw new Error("Expecting data from mesh callback for uniform " + uniformVariable.name);
                }
              }
              break;
              default: {
                throw new Error("uniform type => " + uniformVariable.type);
              }
            }
          }
          else {
            // Backstop in case it's not being checked in construction
            throw new Error("callback not supplied");
          }
        }); 

        vertexAttributes.forEach(function(vertexAttribute) {
          vertexAttribute.enable(context);
        });

        vertexAttributes.forEach(function(vertexAttribute) {
          vertexAttribute.bind(context);
        });

        geometry.draw(context);
        elements.bind(context);

        vertexAttributes.forEach(function(vertexAttribute) {
          vertexAttribute.disable(context);
        });
      }
    },
    get position(): blade.Euclidean3 {return base.position },
    set position(position) { base.position = position },
    get attitude(): blade.Euclidean3 {return base.attitude },
    set attitude(attitude) { base.attitude = attitude }
  };

  return publicAPI;
};

export = mesh;
