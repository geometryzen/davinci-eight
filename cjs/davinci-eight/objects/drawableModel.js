var ElementArray = require('../core/ElementArray');
var ChainedUniformProvider = require('../uniforms/ChainedUniformProvider');
var drawableModel = function (mesh, shaders, model) {
    /**
     * Find an attribute by its code name rather than its semantic role (which is the key in AttribMetaInfos)
     */
    function findAttribMetaInfoByVariableName(name, attributes) {
        for (var key in attributes) {
            var attribute = attributes[key];
            if (attribute.name === name) {
                return attribute;
            }
        }
    }
    /**
     * Constructs a ShaderAttribLocation from a declaration.
     */
    function shaderAttributeLocationFromDecl(declaration) {
        // Looking up the attribute meta info gives us some early warning if the mesh is deficient.
        var attribute = findAttribMetaInfoByVariableName(declaration.name, mesh.getAttribMeta());
        if (attribute) {
            return shaders.attributeLocation(declaration.name);
        }
        else {
            var message = "The mesh does not support attribute " + declaration.type + " " + declaration.name;
            console.warn(message);
            throw new Error(message);
        }
    }
    /**
     * Constructs a ShaderUniformLocation from a declaration.
     */
    function shaderUniformLocationFromDecl(declaration) {
        // By using the ShaderProgram, we get to delegate the management of uniform locations. 
        return shaders.uniformLocation(declaration.name);
    }
    function checkUniformsCompleteAndReady(provider) {
        var metas = provider.getUniformMeta();
        shaders.uniforms.forEach(function (uniformDecl) {
            var match = void 0;
            for (var id in metas) {
                var candidate = metas[id];
                if (candidate.name === uniformDecl.name) {
                    match = candidate;
                }
            }
            if (match === void 0) {
                var message = "Missing uniform " + uniformDecl.type + " " + uniformDecl.name;
                console.warn(message);
                throw new Error(message);
            }
            else {
                if (match.glslType !== uniformDecl.type) {
                    var message = "Mismatch in uniform types " + uniformDecl.name;
                    console.warn(message);
                    throw new Error(message);
                }
                else {
                }
            }
        });
    }
    var context;
    var contextGainId;
    var elements = new ElementArray(mesh);
    var vertexAttributes = shaders.attributes.map(shaderAttributeLocationFromDecl);
    var uniformVariables = shaders.uniforms.map(shaderUniformLocationFromDecl);
    function updateGeometry() {
        // Make sure to update the mesh first so that the shaders gets the correct data.
        mesh.update(shaders.attributes);
        vertexAttributes.forEach(function (vertexAttribute) {
            var thing = mesh.getAttribArray(vertexAttribute.name);
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
    var publicAPI = {
        get mesh() {
            return mesh;
        },
        get shaders() {
            return shaders;
        },
        get model() {
            return model;
        },
        contextFree: function () {
            shaders.contextFree();
            elements.contextFree();
            context = null;
            contextGainId = null;
        },
        contextGain: function (contextArg, contextId) {
            context = contextArg;
            if (contextGainId !== contextId) {
                contextGainId = contextId;
                shaders.contextGain(context, contextId);
                elements.contextGain(context, contextId);
                if (!mesh.dynamic) {
                    updateGeometry();
                }
            }
        },
        contextLoss: function () {
            shaders.contextLoss();
            elements.contextLoss();
            context = null;
            contextGainId = null;
        },
        hasContext: function () {
            return shaders.hasContext();
        },
        get drawGroupName() { return shaders.programId; },
        /**
         * @method useProgram
         */
        useProgram: function () { return shaders.use(); },
        /**
         * @method draw
         * @param ambients {UniformProvider}
         */
        draw: function (ambients) {
            if (shaders.hasContext()) {
                if (mesh.dynamic) {
                    updateGeometry();
                }
                var chainedProvider = new ChainedUniformProvider(model, ambients);
                checkUniformsCompleteAndReady(chainedProvider);
                // check we have them all.
                // check they are all initialized.
                // Update the uniform location values.
                uniformVariables.forEach(function (uniformVariable) {
                    switch (uniformVariable.glslType) {
                        case 'float':
                            {
                                var data = chainedProvider.getUniformFloat(uniformVariable.name);
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
                        case 'vec2':
                            {
                                var data = chainedProvider.getUniformVector2(uniformVariable.name);
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
                        case 'vec3':
                            {
                                var data = chainedProvider.getUniformVector3(uniformVariable.name);
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
                        case 'vec4':
                            {
                                var data = chainedProvider.getUniformVector4(uniformVariable.name);
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
                        case 'mat3':
                            {
                                var data = chainedProvider.getUniformMatrix3(uniformVariable.name);
                                if (data) {
                                    uniformVariable.uniformMatrix3fv(data.transpose, data.matrix3);
                                }
                                else {
                                    throw new Error("Expecting data for uniform " + uniformVariable.name);
                                }
                            }
                            break;
                        case 'mat4':
                            {
                                var data = chainedProvider.getUniformMatrix4(uniformVariable.name);
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
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.enable();
                });
                vertexAttributes.forEach(function (vertexAttribute) {
                    var attribute = findAttribMetaInfoByVariableName(vertexAttribute.name, mesh.getAttribMeta());
                    if (attribute) {
                        var size = attribute.size;
                        var type = context.FLOAT; //attribute.dataType;
                        var normalized = attribute.normalized;
                        var stride = attribute.stride;
                        var offset = attribute.offset;
                        vertexAttribute.dataFormat(size, type, normalized, stride, offset);
                    }
                    else {
                        throw new Error("The mesh does not support the attribute variable named " + vertexAttribute.name);
                    }
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
