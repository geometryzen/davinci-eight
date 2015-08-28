var ElementArray = require('../core/ElementArray');
var getAttribVarName = require('../core/getAttribVarName');
var updateUniform = require('../core/updateUniform');
var primitive = function (mesh, program, model) {
    /**
     * Find an attribute by its code name rather than its semantic role (which is the key in AttribMetaInfos)
     */
    function findAttribMetaInfoByVariableName(attribVarName, attributes) {
        for (var name in attributes) {
            var attribute = attributes[name];
            if (getAttribVarName(attribute, name) === attribVarName) {
                return attribute;
            }
        }
    }
    var context;
    var contextGainId;
    var elements = new ElementArray(mesh);
    var self = {
        get mesh() {
            return mesh;
        },
        get shaders() {
            return program;
        },
        get model() {
            return model;
        },
        contextFree: function () {
            program.contextFree();
            elements.contextFree();
            context = null;
            contextGainId = null;
        },
        contextGain: function (contextArg, contextId) {
            context = contextArg;
            if (contextGainId !== contextId) {
                contextGainId = contextId;
                program.contextGain(context, contextId);
                elements.contextGain(context, contextId);
            }
        },
        contextLoss: function () {
            program.contextLoss();
            elements.contextLoss();
            context = null;
            contextGainId = null;
        },
        hasContext: function () {
            return program.hasContext();
        },
        /**
         * @property program
         */
        get program() { return program; },
        /**
         * @method draw
         */
        draw: function () {
            if (!program.hasContext()) {
                return;
            }
            if (mesh.dynamic) {
                mesh.update();
            }
            // attributes
            var attributeLocations = program.attributeLocations;
            for (var name in attributeLocations) {
                var thing = mesh.getAttribArray(name);
                if (thing) {
                    attributeLocations[name].bufferData(thing.data, thing.usage);
                }
                else {
                    // We expect this to be detected long before we get here.
                    throw new Error("mesh implementation claims to support, but does not provide data for, attribute " + name);
                }
            }
            // elements
            elements.bufferData(mesh);
            // uniforms
            var uniformLocations = program.uniformLocations;
            var umis = model.getUniformMeta();
            for (var name in umis) {
                var uniformLocation = uniformLocations[name];
                if (uniformLocation) {
                    updateUniform(uniformLocation, model);
                }
            }
            for (var name in attributeLocations) {
                var attribLocation = attributeLocations[name];
                attribLocation.enable();
                var attribute = findAttribMetaInfoByVariableName(attribLocation.name, mesh.getAttribMeta());
                if (attribute) {
                    var size = attribute.size;
                    var type = context.FLOAT; //attribute.dataType;
                    var normalized = attribute.normalized;
                    var stride = attribute.stride;
                    var offset = attribute.offset;
                    attribLocation.dataFormat(size, type, normalized, stride, offset);
                }
                else {
                    throw new Error("The mesh does not support the attribute variable named " + attribLocation.name);
                }
            }
            elements.bind();
            mesh.draw(context);
            for (var name in attributeLocations) {
                var attribLocation = attributeLocations[name];
                attribLocation.disable();
            }
        }
    };
    if (!mesh.dynamic) {
        mesh.update();
    }
    return self;
};
module.exports = primitive;
