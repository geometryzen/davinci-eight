var mesh = require('./mesh');
var Matrix3 = require('../math/Matrix3');
var Matrix4 = require('../math/Matrix4');
var GeometryVertexAttributeProvider = require('../geometries/GeometryVertexAttributeProvider');
function modelViewMatrix(position, attitude) {
    var matrix = new Matrix4();
    matrix.identity();
    matrix.translate(position);
    var rotation = new Matrix4();
    rotation.rotate(attitude);
    matrix.mul(rotation);
    return matrix;
}
var MeshVertexUniformProvider = (function () {
    function MeshVertexUniformProvider() {
    }
    MeshVertexUniformProvider.prototype.getUniformMatrix3 = function (name) {
        switch (name) {
            case 'uN':
                {
                    // It's unfortunate that we have to recompute the model-view matrix.
                    // We could cache it, being careful that we don't assume the callback order.
                    // We don't want to compute it in the shader beacause that would be per-vertex.
                    var normalMatrix = new Matrix3();
                    var mv = modelViewMatrix(this.position, this.attitude);
                    normalMatrix.normalFromMatrix4(mv);
                    return { transpose: false, matrix3: new Float32Array(normalMatrix.elements) };
                }
                break;
            default: {
                return null;
            }
        }
    };
    MeshVertexUniformProvider.prototype.getUniformMatrix4 = function (name) {
        switch (name) {
            case 'uMV':
                {
                    var elements = modelViewMatrix(this.position, this.attitude).elements;
                    return { transpose: false, matrix4: new Float32Array(elements) };
                }
                break;
            default: {
                return null;
            }
        }
    };
    return MeshVertexUniformProvider;
})();
var Mesh = (function () {
    function Mesh(geometry, material) {
        this.meshVertexUniformProvider = new MeshVertexUniformProvider();
        this.geometry = geometry;
        var mvap = new GeometryVertexAttributeProvider(geometry);
        this.innerMesh = mesh(mvap, material, this.meshVertexUniformProvider);
    }
    Object.defineProperty(Mesh.prototype, "material", {
        get: function () {
            return this.innerMesh.material;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "attitude", {
        get: function () {
            return this.innerMesh.attitude;
        },
        set: function (value) {
            this.innerMesh.attitude = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "position", {
        get: function () {
            return this.innerMesh.position;
        },
        set: function (value) {
            this.innerMesh.position = value;
        },
        enumerable: true,
        configurable: true
    });
    Mesh.prototype.setRotationFromQuaternion = function (q) {
        this.innerMesh.attitude.yz = q.x;
        this.innerMesh.attitude.zx = q.y;
        this.innerMesh.attitude.xy = q.z;
        this.innerMesh.attitude.w = q.w;
    };
    Object.defineProperty(Mesh.prototype, "drawGroupName", {
        get: function () {
            return this.innerMesh.drawGroupName;
        },
        enumerable: true,
        configurable: true
    });
    Mesh.prototype.useProgram = function (context) {
        this.innerMesh.useProgram(context);
    };
    Mesh.prototype.draw = function (context, time, uniformProvider) {
        this.meshVertexUniformProvider.position = this.innerMesh.position;
        this.meshVertexUniformProvider.attitude = this.innerMesh.attitude;
        return this.innerMesh.draw(context, time, uniformProvider);
    };
    Mesh.prototype.contextFree = function (context) {
        return this.innerMesh.contextFree(context);
    };
    Mesh.prototype.contextGain = function (context, contextGainId) {
        return this.innerMesh.contextGain(context, contextGainId);
    };
    Mesh.prototype.contextLoss = function () {
        return this.innerMesh.contextLoss();
    };
    Mesh.prototype.hasContext = function () {
        return this.innerMesh.hasContext();
    };
    Mesh.getUniformMetaInfo = function () {
        var uniforms = {};
        uniforms['modelViewMatrix'] = { name: 'uMV', type: 'mat4' };
        uniforms['normalMatrix'] = { name: 'uN', type: 'mat3' };
        return uniforms;
    };
    return Mesh;
})();
module.exports = Mesh;
