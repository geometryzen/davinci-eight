/// <reference path="./FactoredDrawable.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
/// <reference path="../materials/Material.d.ts" />
/// <reference path="../renderers/UniformProvider.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var ShaderAttributeVariable = require('./ShaderAttributeVariable');
var object3D = require('davinci-eight/core/object3D');
var ElementArray = require('davinci-eight/objects/ElementArray');
var ShaderUniformVariable = require('davinci-eight/objects/ShaderUniformVariable');
var ChainedUniformProvider = require('./ChainedUniformProvider');
var mesh = function (geometry, material, meshUniforms) {
    /**
     * Find an attribute by its code name rather than its semantic role (which is the key in AttributeMetaInfos)
     */
    function findAttributeByVariableName(name, attributes) {
        for (var key in attributes) {
            var attribute = attributes[key];
            if (attribute.name === name) {
                return attribute;
            }
        }
    }
    /**
     * Constructs a ShaderAttributeVariable from a declaration.
     */
    function vertexAttrib(declaration) {
        var name = declaration.name;
        var attribute = findAttributeByVariableName(name, geometry.getAttributeMetaInfos());
        if (attribute) {
            var size = attribute.size;
            var normalized = attribute.normalized;
            var stride = attribute.stride;
            var offset = attribute.offset;
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
    function shaderUniformFromDecl(declaration) {
        var modifiers = declaration.modifiers;
        var type = declaration.type;
        var name = declaration.name;
        return new ShaderUniformVariable(name, type);
    }
    var base = object3D();
    var contextGainId;
    var elements = new ElementArray(geometry);
    var vertexAttributes = material.attributes.map(vertexAttrib);
    var uniformVariables = material.uniforms.map(shaderUniformFromDecl);
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
    function updateGeometry(context, time) {
        // Make sure to update the geometry first so that the material gets the correct data.
        geometry.update(time, material.attributes);
        vertexAttributes.forEach(function (vertexAttribute) {
            vertexAttribute.bufferData(context, geometry);
        });
        elements.bufferData(context, geometry);
    }
    var publicAPI = {
        get geometry() {
            return geometry;
        },
        get material() {
            return material;
        },
        contextFree: function (context) {
            material.contextFree(context);
            vertexAttributes.forEach(function (vertexAttribute) {
                vertexAttribute.contextFree(context);
            });
            elements.contextFree(context);
        },
        contextGain: function (context, contextId) {
            if (contextGainId !== contextId) {
                contextGainId = contextId;
                material.contextGain(context, contextId);
                // Cache the attribute variable locations.
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.contextGain(context, material.program);
                });
                elements.contextGain(context);
                if (!geometry.dynamic()) {
                    updateGeometry(context, 0);
                }
                // Cache the uniform variable locations.
                uniformVariables.forEach(function (uniformVariable) {
                    uniformVariable.contextGain(context, material.program);
                });
            }
        },
        contextLoss: function () {
            material.contextLoss();
            vertexAttributes.forEach(function (vertexAttribute) {
                vertexAttribute.contextLoss();
            });
            elements.contextLoss();
        },
        hasContext: function () {
            return material.hasContext();
        },
        get drawGroupName() { return material.programId; },
        useProgram: function (context) {
            context.useProgram(material.program);
        },
        draw: function (context, time, ambientUniforms) {
            if (material.hasContext()) {
                if (geometry.dynamic()) {
                    updateGeometry(context, time);
                }
                // Update the uniform location values.
                uniformVariables.forEach(function (uniformVariable) {
                    if (meshUniforms) {
                        var chainedProvider = new ChainedUniformProvider(meshUniforms, ambientUniforms);
                        switch (uniformVariable.type) {
                            case 'mat3':
                                {
                                    var m3data = chainedProvider.getUniformMatrix3(uniformVariable.name);
                                    if (m3data) {
                                        uniformVariable.matrix(context, m3data.transpose, m3data.matrix3);
                                    }
                                    else {
                                        throw new Error("Expecting data from mesh callback for uniform " + uniformVariable.name);
                                    }
                                }
                                break;
                            case 'mat4':
                                {
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
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.enable(context);
                });
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.bind(context);
                });
                geometry.draw(context);
                elements.bind(context);
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.disable(context);
                });
            }
        },
        get position() { return base.position; },
        set position(position) { base.position = position; },
        get attitude() { return base.attitude; },
        set attitude(attitude) { base.attitude = attitude; }
    };
    return publicAPI;
};
module.exports = mesh;
