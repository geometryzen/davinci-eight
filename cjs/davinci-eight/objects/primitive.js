var ElementArray = require('../core/ElementArray');
var getAttribVarName = require('../core/getAttribVarName');
var setAttributes = require('../programs/setAttributes');
var setUniforms = require('../programs/setUniforms');
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
        get program() {
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
         * @method draw
         */
        draw: function () {
            if (!program.hasContext()) {
                return;
            }
            if (mesh.dynamic) {
                mesh.update();
            }
            // NEW attributes
            // No problem here because we loop on keys in buffers.
            var buffers = {};
            var metas = mesh.getAttribMeta();
            setAttributes(program.attribSetters, buffers, metas);
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
            setUniforms(program.uniformSetters, model.getUniformData());
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
