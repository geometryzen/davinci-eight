var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../math/Matrix3', '../math/Matrix4', '../uniforms/TreeModel', '../math/Spinor3', '../core/Symbolic', '../math/Vector3', '../core/Color', '../uniforms/UniformColor'], function (require, exports, Matrix3, Matrix4, TreeModel, Spinor3, Symbolic, Vector3, Color, UniformColor) {
    function localMatrix(scale, attitude, position) {
        var S = Matrix4.identity();
        S.scaling(scale);
        var T = Matrix4.identity();
        T.translation(position);
        var R = Matrix4.identity();
        R.rotation(attitude);
        T.mul(R.mul(S));
        return T;
    }
    /**
     * @class Node
     * @extends TreeModel
     */
    var Node = (function (_super) {
        __extends(Node, _super);
        /**
         * @class Model
         * @constructor
         */
        function Node(options) {
            _super.call(this);
            options = options || {};
            this.modelMatrixName = options.modelMatrixName || Symbolic.UNIFORM_MODEL_MATRIX;
            this.normalMatrixName = options.normalMatrixName || Symbolic.UNIFORM_NORMAL_MATRIX;
            this.colorVarName = options.colorVarName || Symbolic.UNIFORM_COLOR;
            this.position = new Vector3();
            this.attitude = new Spinor3();
            this.scale = new Vector3([1, 1, 1]);
            this.uColor = new UniformColor(this.colorVarName, Symbolic.UNIFORM_COLOR);
        }
        Object.defineProperty(Node.prototype, "color", {
            get: function () {
                return this.uColor.data;
            },
            set: function (color) {
                this.uColor.data = color;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method getUniformVector3
         * @param name {string}
         */
        Node.prototype.getUniformVector3 = function (name) {
            //console.log("getUniformVector3(name='" + name + "')");
            switch (name) {
                case this.colorVarName:
                    {
                        if (this.uColor.data) {
                            return this.uColor.getUniformVector3(name);
                        }
                        else if (this.getParent()) {
                            return this.getParent().getUniformVector3(name);
                        }
                        else {
                            return Color.fromRGB(1, 1, 1).data;
                        }
                    }
                    break;
                default: {
                    return _super.prototype.getUniformVector3.call(this, name);
                }
            }
        };
        Node.prototype.getNormalMatrix = function () {
            // It's unfortunate that we have to recompute the model-view matrix.
            // We could cache it, being careful that we don't assume the callback order.
            // We don't want to compute it in the shader beacause that would be per-vertex.
            var normalMatrix = Matrix3.identity();
            var mv = localMatrix(this.scale, this.attitude, this.position);
            normalMatrix.normalFromMatrix4(mv);
            // TODO: elements in Matrix3 should already be Float32Array
            return normalMatrix.elements;
        };
        /**
         * @method getUniformMatrix3
         * @param name {string}
         */
        Node.prototype.getUniformMatrix3 = function (name) {
            switch (name) {
                case this.normalMatrixName:
                    {
                        return { transpose: false, matrix3: this.getNormalMatrix() };
                    }
                    break;
                default: {
                    return _super.prototype.getUniformMatrix3.call(this, name);
                }
            }
        };
        Node.prototype.getModelMatrix = function () {
            if (this.getParent()) {
                var um4 = this.getParent().getUniformMatrix4(name);
                if (um4) {
                    var m1 = new Matrix4(um4.matrix4);
                    var m2 = localMatrix(this.scale, this.attitude, this.position);
                    var m = Matrix4.identity().multiplyMatrices(m1, m2);
                    return m.elements;
                }
                else {
                    var m = localMatrix(this.scale, this.attitude, this.position);
                    return m.elements;
                }
            }
            else {
                var m = localMatrix(this.scale, this.attitude, this.position);
                return m.elements;
            }
        };
        /**
         * @method getUniformMatrix4
         * @param name {string}
         */
        Node.prototype.getUniformMatrix4 = function (name) {
            switch (name) {
                case this.modelMatrixName:
                    {
                        return { transpose: false, matrix4: this.getModelMatrix() };
                    }
                    break;
                default: {
                    return this.uColor.getUniformMatrix4(name);
                }
            }
        };
        /**
         * @method getUniformMeta
         */
        Node.prototype.getUniformMeta = function () {
            var uniforms = this.uColor.getUniformMeta();
            uniforms[Symbolic.UNIFORM_MODEL_MATRIX] = { name: this.modelMatrixName, glslType: 'mat4' };
            uniforms[Symbolic.UNIFORM_NORMAL_MATRIX] = { name: this.normalMatrixName, glslType: 'mat3' };
            return uniforms;
        };
        /**
         * @method getUniformData
         */
        Node.prototype.getUniformData = function () {
            var data = this.uColor.getUniformData();
            data[Symbolic.UNIFORM_MODEL_MATRIX] = {
                transpose: false,
                matrix3: void 0,
                matrix4: this.getModelMatrix(),
                uniformZs: void 0
            };
            data[Symbolic.UNIFORM_NORMAL_MATRIX] = {
                transpose: false,
                matrix3: this.getNormalMatrix(),
                matrix4: void 0,
                uniformZs: void 0
            };
            return data;
        };
        return Node;
    })(TreeModel);
    return Node;
});
