/// <reference path="./Mesh.d.ts" />
/// <reference path="../cameras/Camera.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
/// <reference path="../materials/Material.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var VertexAttribArray = require('./VertexAttribArray');
var object3D = require('davinci-eight/core/object3D');
var glMatrix = require('gl-matrix');
var ElementArray = require('davinci-eight/objects/ElementArray');
// A work in progress?
var UniformMatrix4fv = (function () {
    function UniformMatrix4fv(name) {
        this.name = name;
    }
    UniformMatrix4fv.prototype.contextGain = function (context, program) {
        this.location = context.getUniformLocation(program, this.name);
    };
    UniformMatrix4fv.prototype.foo = function (context, transpose, matrix) {
        context.uniformMatrix4fv(this.location, transpose, matrix);
    };
    return UniformMatrix4fv;
})();
var mesh = function (geometry, material) {
    /**
     *
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
    var base = object3D();
    var contextGainId;
    var elements = new ElementArray(geometry);
    var vertexAttributes = material.attributes.map(vertexAttrib);
    var MVMatrix = new UniformMatrix4fv('uMVMatrix');
    var uNormalMatrix;
    var PMatrix = new UniformMatrix4fv('uPMatrix');
    // It might be nice to decouple from glMatrix, since that is the direction?
    var matrix = glMatrix.mat4.create();
    var normalMatrix = glMatrix.mat3.create();
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
                vertexAttributes.forEach(function (vertexAttribute) {
                    vertexAttribute.contextGain(context, material.program);
                });
                elements.contextGain(context);
                if (!geometry.dynamic()) {
                    updateGeometry(context, 0);
                }
                // TODO; We won't need material.program when these are encapsulated.
                MVMatrix.contextGain(context, material.program);
                // This could come back as null, meaning there is no such Uniform in the shader.
                uNormalMatrix = context.getUniformLocation(material.program, 'uNormalMatrix');
                PMatrix.contextGain(context, material.program);
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
        draw: function (context, time, camera) {
            var position = base.position;
            var attitude = base.attitude;
            if (material.hasContext()) {
                if (geometry.dynamic()) {
                    updateGeometry(context, time);
                }
                glMatrix.mat4.identity(matrix);
                glMatrix.mat4.translate(matrix, matrix, [position.x, position.y, position.z]);
                var rotationMatrix = glMatrix.mat4.create();
                glMatrix.mat4.fromQuat(rotationMatrix, [attitude.yz, attitude.zx, attitude.xy, attitude.w]);
                glMatrix.mat4.mul(matrix, matrix, rotationMatrix);
                rotationMatrix = null;
                PMatrix.foo(context, false, camera.projectionMatrix);
                MVMatrix.foo(context, false, matrix);
                if (uNormalMatrix) {
                    glMatrix.mat3.normalFromMat4(normalMatrix, matrix);
                    context.uniformMatrix3fv(uNormalMatrix, false, normalMatrix);
                }
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
