/// <reference path='../materials/Material'/>
/// <reference path='../materials/UniformMetaInfo'/>
var Camera = require('../cameras/Camera');
var Mesh = require('../objects/Mesh');
var smartMaterial = require('../materials/smartMaterial');
// Can we defer the creation of smartMaterial until the geometry is known?
// Maybe the mesh tells the material ablout the geometry?
var attributes = {
    position: { name: 'aVertexPosition', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
    color: { name: 'aVertexColor', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 },
    normal: { name: 'aVertexNormal', type: 'vec3', size: 3, normalized: false, stride: 0, offset: 0 }
};
var MeshBasicMaterial = (function () {
    function MeshBasicMaterial() {
        var uniforms = Camera.getUniformMetaInfo();
        var descriptors = Mesh.getUniformMetaInfo();
        for (var name in descriptors) {
            uniforms[name] = descriptors[name];
        }
        this.material = smartMaterial(attributes, uniforms);
    }
    MeshBasicMaterial.prototype.contextFree = function (context) {
        return this.material.contextFree(context);
    };
    MeshBasicMaterial.prototype.contextGain = function (context, contextGainId) {
        return this.material.contextGain(context, contextGainId);
    };
    MeshBasicMaterial.prototype.contextLoss = function () {
        return this.material.contextLoss();
    };
    MeshBasicMaterial.prototype.hasContext = function () {
        return this.material.hasContext();
    };
    Object.defineProperty(MeshBasicMaterial.prototype, "attributes", {
        get: function () {
            return this.material.attributes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeshBasicMaterial.prototype, "uniforms", {
        get: function () {
            return this.material.uniforms;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeshBasicMaterial.prototype, "varyings", {
        get: function () {
            return this.material.varyings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeshBasicMaterial.prototype, "program", {
        get: function () {
            return this.material.program;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeshBasicMaterial.prototype, "programId", {
        get: function () {
            return this.material.programId;
        },
        enumerable: true,
        configurable: true
    });
    return MeshBasicMaterial;
})();
module.exports = MeshBasicMaterial;
