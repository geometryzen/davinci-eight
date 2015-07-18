var ShaderAttributeVariable = require('../core/ShaderAttributeVariable');
var ShaderUniformVariable = require('../core/ShaderUniformVariable');
var ElementArray = require('../core/ElementArray');
var ChainedVertexUniformProvider = require('./ChainedVertexUniformProvider');
var drawableModel = function (mesh, model, shaderProgram) {
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
        var attribute = findAttributeByVariableName(name, mesh.getAttributeMetaInfos());
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
    var context;
    var contextGainId;
    var elements = new ElementArray(mesh);
    var vertexAttributes = shaderProgram.attributes.map(vertexAttrib);
    var uniformVariables = shaderProgram.uniforms.map(shaderUniformFromDecl);
    function updateGeometry() {
        // Make sure to update the mesh first so that the shaderProgram gets the correct data.
        mesh.update(shaderProgram.attributes);
        vertexAttributes.forEach(function (vertexAttribute) {
            vertexAttribute.bufferData(mesh);
        });
        elements.bufferData(mesh);
    }
    var publicAPI = {
        get mesh() {
            return mesh;
        },
        get shaderProgram() {
            return shaderProgram;
        },
        get model() {
            return model;
        },
        contextFree: function () {
            shaderProgram.contextFree();
            vertexAttributes.forEach(function (vertexAttribute) {
                vertexAttribute.contextFree();
            });
            elements.contextFree();
            context = null;
            contextGainId = null;
        },
        contextGain: function (contextArg, contextId) {
            context = contextArg;
            if (contextGainId !== contextId) {
                contextGainId = contextId;
                shaderProgram.contextGain(context, contextId);
                // Cache the attribute variable locations.
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.contextGain(context, shaderProgram.program);
                });
                elements.contextGain(context);
                // TODO: This should really be consulting a needsUpdate method.
                // We can also put the updates inside the vertexAttribute loop.
                if (!mesh.dynamics()) {
                    updateGeometry();
                }
                // Cache the uniform variable locations.
                uniformVariables.forEach(function (uniformVariable) {
                    uniformVariable.contextGain(context, shaderProgram.program);
                });
            }
        },
        contextLoss: function () {
            shaderProgram.contextLoss();
            vertexAttributes.forEach(function (vertexAttribute) {
                vertexAttribute.contextLoss();
            });
            elements.contextLoss();
            context = null;
            contextGainId = null;
        },
        hasContext: function () {
            return shaderProgram.hasContext();
        },
        get drawGroupName() { return shaderProgram.programId; },
        useProgram: function () {
            context.useProgram(shaderProgram.program);
        },
        draw: function (view) {
            if (shaderProgram.hasContext()) {
                // TODO: This should be a needs update.
                if (mesh.dynamics()) {
                    updateGeometry();
                }
                // Update the uniform location values.
                uniformVariables.forEach(function (uniformVariable) {
                    var chainedProvider = new ChainedVertexUniformProvider(model, view);
                    switch (uniformVariable.type) {
                        case 'vec3':
                            {
                                var vector = chainedProvider.getUniformVector3(uniformVariable.name);
                                if (vector) {
                                    uniformVariable.vec3([vector.x, vector.y, vector.z]);
                                }
                                else {
                                    throw new Error("Expecting data for uniform " + uniformVariable.name);
                                }
                            }
                            break;
                        case 'mat3':
                            {
                                var m3data = chainedProvider.getUniformMatrix3(uniformVariable.name);
                                if (m3data) {
                                    uniformVariable.mat3(m3data.transpose, m3data.matrix3);
                                }
                                else {
                                    throw new Error("Expecting data for uniform " + uniformVariable.name);
                                }
                            }
                            break;
                        case 'mat4':
                            {
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
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.enable();
                });
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.bind();
                });
                elements.bind();
                mesh.draw(context);
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.disable();
                });
            }
        }
    };
    return publicAPI;
};
module.exports = drawableModel;
