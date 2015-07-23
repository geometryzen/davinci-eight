define(["require", "exports", '../core/ElementArray', '../uniforms/ChainedUniformProvider'], function (require, exports, ElementArray, ChainedUniformProvider) {
    var drawableModel = function (mesh, shaders, model) {
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
                // All this machinary will be required at runtime.
                //let size = attribute.size;
                //let normalized = attribute.normalized;
                //let stride = attribute.stride;
                //let offset = attribute.offset;
                // By using the ShaderProgram, we get to delegate the management of attribute locations. 
                return shaders.attributeVariable(name);
            }
            else {
                throw new Error("The mesh does not support the attribute variable named " + name);
            }
        }
        /**
         * Constructs a ShaderUniformVariable from a declaration.
         */
        function shaderUniformFromDecl(declaration) {
            // By using the ShaderProgram, we get to delegate the management of uniform locations. 
            return shaders.uniformVariable(declaration.name);
        }
        var context;
        var contextGainId;
        var elements = new ElementArray(mesh);
        var vertexAttributes = shaders.attributes.map(vertexAttrib);
        var uniformVariables = shaders.uniforms.map(shaderUniformFromDecl);
        function updateGeometry() {
            // Make sure to update the mesh first so that the shaders gets the correct data.
            mesh.update(shaders.attributes);
            vertexAttributes.forEach(function (vertexAttribute) {
                vertexAttribute.bufferData(mesh);
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
                    // TODO: This should really be consulting a needsUpdate method.
                    // We can also put the updates inside the vertexAttribute loop.
                    if (!mesh.dynamics()) {
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
            draw: function (view) {
                if (shaders.hasContext()) {
                    // TODO: This should be a needs update.
                    if (mesh.dynamics()) {
                        updateGeometry();
                    }
                    // Update the uniform location values.
                    uniformVariables.forEach(function (uniformVariable) {
                        var chainedProvider = new ChainedUniformProvider(model, view);
                        switch (uniformVariable.type) {
                            case 'vec2':
                                {
                                    var data = chainedProvider.getUniformVector2(uniformVariable.name);
                                    if (data) {
                                        if (data.length === 2) {
                                            uniformVariable.uniform2fv(data);
                                        }
                                        else {
                                            throw new Error("Expecting data for uniform " + uniformVariable.name + " to be number[] with length 2");
                                        }
                                    }
                                    else {
                                        throw new Error("Expecting data for uniform " + uniformVariable.name);
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
                                    var m3data = chainedProvider.getUniformMatrix3(uniformVariable.name);
                                    if (m3data) {
                                        uniformVariable.uniformMatrix3fv(m3data.transpose, m3data.matrix3);
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
                                        uniformVariable.uniformMatrix4fv(m4data.transpose, m4data.matrix4);
                                    }
                                    else {
                                        throw new Error("Expecting data for uniform " + uniformVariable.name);
                                    }
                                }
                                break;
                            default: {
                                throw new Error("Unexpected type in drawableModel.draw: " + uniformVariable.type);
                            }
                        }
                    });
                    vertexAttributes.forEach(function (vertexAttribute) {
                        vertexAttribute.enable();
                    });
                    vertexAttributes.forEach(function (vertexAttribute) {
                        var attribute = findAttributeByVariableName(vertexAttribute.name, mesh.getAttributeMetaInfos());
                        if (attribute) {
                            var size = attribute.size;
                            var normalized = attribute.normalized;
                            var stride = attribute.stride;
                            var offset = attribute.offset;
                            vertexAttribute.dataFormat(size, normalized, stride, offset);
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
    return drawableModel;
});
