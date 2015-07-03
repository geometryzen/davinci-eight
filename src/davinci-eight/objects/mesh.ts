/// <reference path="./Mesh.d.ts" />
/// <reference path="../cameras/Camera.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
/// <reference path="../materials/Material.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import VertexAttribArray = require('./VertexAttribArray');
import object3D = require('davinci-eight/core/object3D');
import vs_source = require('davinci-eight/shaders/shader-vs');
import fs_source = require('davinci-eight/shaders/shader-fs');
import glMatrix = require('gl-matrix');
import ElementArray = require('davinci-eight/objects/ElementArray');
import ShaderUniformVariable = require('davinci-eight/objects/ShaderUniformVariable');

var mesh = function<G extends Geometry, M extends Material>(
  geometry: G,
  material: M,
  callback?: (name: string) => {transpose: boolean, value: any}): Mesh<G, M> {
  /**
   * Constructs a VertexAttribArray from a declaration.
   */
  function vertexAttrib(declaration: { name: string }): VertexAttribArray {
    let attributes = geometry.getAttributes();
    let name = declaration.name;
    let candidates = attributes.filter(function(attribute) {return attribute.name === name;});
    if (candidates.length === 1) {
      let candidate = candidates[0];
      let size = candidate.size;
      let normalized = candidate.normalized;
      let stride = candidate.stride;
      let offset = candidate.offset;
      return new VertexAttribArray(name, size, normalized, stride, offset);
    }
    else {
      throw new Error("The geometry does not support the attribute " + name);
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
  var vertexAttributes: VertexAttribArray[] = material.attributes.map(vertexAttrib);
  var uniformVariables: ShaderUniformVariable[] = material.uniforms.map(shaderUniformFromDecl);
  if (uniformVariables.length > 0) {
    if (typeof callback === 'undefined') {
      throw new Error('callback argument must be supplied for shader uniform variables.');
    }
    else {
      if (typeof callback !== 'function') {
        throw new Error('callback must be a function.');
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

        if (!geometry.dynamic()) {
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
    draw(context: WebGLRenderingContext, time: number) {

      if (material.hasContext()) {
        if (geometry.dynamic()) {
          updateGeometry(context, time);
        }
        // Update the uniform location values.
        uniformVariables.forEach(function(uniformVariable) {
          if (typeof callback === 'function') {
            var data = callback(uniformVariable.name);
            if (data) {
              uniformVariable.matrix(context, data.transpose, data.value);
            }
            else {
              throw new Error("Expecting data from mesh callback for uniform " + uniformVariable.name);
            }
          }
          else {
            // Backstop in case it's not being checked in construction
            throw new Error("callback not supplied or not a function.");
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
