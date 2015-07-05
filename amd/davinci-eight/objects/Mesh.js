define(["require", "exports", "davinci-blade/Euclidean3", './mesh', '../math/Matrix3', '../math/Matrix4'], function (require, exports, Euclidean3, mesh, Matrix3, Matrix4) {
    function modelViewMatrix(position, attitude) {
        var matrix = new Matrix4();
        matrix.identity();
        matrix.translate(position);
        var rotation = new Matrix4();
        rotation.rotate(attitude);
        matrix.mul(rotation);
        return matrix;
    }
    var MeshUniformProvider = (function () {
        function MeshUniformProvider() {
        }
        MeshUniformProvider.prototype.getUniformMatrix3 = function (name) {
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
        MeshUniformProvider.prototype.getUniformMatrix4 = function (name) {
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
        return MeshUniformProvider;
    })();
    var Mesh = (function () {
        function Mesh(geometry, material) {
            this.meshUniformProvider = new MeshUniformProvider();
            this.innerMesh = mesh(geometry, material, this.meshUniformProvider);
        }
        Object.defineProperty(Mesh.prototype, "geometry", {
            get: function () {
                return this.innerMesh.geometry;
            },
            enumerable: true,
            configurable: true
        });
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
            this.meshUniformProvider.position = this.innerMesh.position;
            this.meshUniformProvider.attitude = this.innerMesh.attitude;
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
    return Mesh;
});
