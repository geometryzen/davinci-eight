define(["require", "exports", './VertexAttribArray', 'davinci-eight/core/object3D', 'davinci-eight/objects/ElementArray', 'davinci-eight/objects/ShaderUniformVariable'], function (require, exports, VertexAttribArray, object3D, ElementArray, ShaderUniformVariable) {
    var mesh = function (geometry, material, callback) {
        /**
         * Constructs a VertexAttribArray from a declaration.
         */
        function vertexAttrib(declaration) {
            var attributes = geometry.getAttributes();
            var name = declaration.name;
            var candidates = attributes.filter(function (attribute) { return attribute.name === name; });
            if (candidates.length === 1) {
                var candidate = candidates[0];
                var size = candidate.size;
                var normalized = candidate.normalized;
                var stride = candidate.stride;
                var offset = candidate.offset;
                return new VertexAttribArray(name, size, normalized, stride, offset);
            }
            else {
                throw new Error("The geometry does not support the attribute " + name);
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
            if (typeof callback === 'undefined') {
                throw new Error('callback argument must be supplied for shader uniform variables.');
            }
            else {
                if (typeof callback !== 'function') {
                    throw new Error('callback must be a function.');
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
            draw: function (context, time) {
                if (material.hasContext()) {
                    if (geometry.dynamic()) {
                        updateGeometry(context, time);
                    }
                    // Update the uniform location values.
                    uniformVariables.forEach(function (uniformVariable) {
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
    return mesh;
});
