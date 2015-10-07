var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Matrix3', '../math/Matrix4', '../i18n/readOnly', '../utils/Shareable', '../math/Spinor3', '../core/Symbolic', '../math/Vector3'], function (require, exports, Matrix3, Matrix4, readOnly, Shareable, Spinor3, Symbolic, Vector3) {
    /**
     * @class ModelFacet
     */
    var ModelFacet = (function (_super) {
        __extends(ModelFacet, _super);
        /**
         * ModelFacet implements IFacet required for manipulating a body.
         * @class ModelFacet
         * @constructor
         */
        function ModelFacet() {
            _super.call(this, 'ModelFacet');
            this._position = new Vector3();
            this._attitude = new Spinor3();
            this._scaleXYZ = new Vector3([1, 1, 1]);
            this.M = Matrix4.identity();
            this.N = Matrix3.identity();
            this.R = Matrix4.identity();
            this.S = Matrix4.identity();
            this.T = Matrix4.identity();
            this._position.modified = true;
            this._attitude.modified = true;
            this._scaleXYZ.modified = true;
        }
        /**
         * @method destructor
         * @return {void}
         */
        ModelFacet.prototype.destructor = function () {
            this._position = void 0;
            this._attitude = void 0;
            this._scaleXYZ = void 0;
            this.M = void 0;
            this.N = void 0;
            this.R = void 0;
            this.S = void 0;
            this.T = void 0;
        };
        Object.defineProperty(ModelFacet.prototype, "attitude", {
            /**
             * @property attitude
             * @type Spinor3
             * @readOnly
             */
            get: function () {
                return this._attitude;
            },
            set: function (unused) {
                throw new Error(readOnly('attitude').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelFacet.prototype, "position", {
            /**
             * @property position
             * @type Vector3
             * @readOnly
             */
            get: function () {
                return this._position;
            },
            set: function (unused) {
                throw new Error(readOnly('position').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelFacet.prototype, "scaleXYZ", {
            /**
             * @property scaleXYZ
             * @type Vector3
             * @readOnly
             */
            get: function () {
                return this._scaleXYZ;
            },
            set: function (unused) {
                throw new Error(readOnly('scaleXYZ').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
        ModelFacet.prototype.getProperty = function (name) {
            switch (name) {
                case ModelFacet.PROP_ATTITUDE: {
                    return this._attitude.data;
                }
                case ModelFacet.PROP_POSITION: {
                    return this._position.data;
                }
                default: {
                    console.warn("ModelFacet.getProperty " + name);
                    return void 0;
                }
            }
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param data {number[]}
         * @return {void}
         */
        ModelFacet.prototype.setProperty = function (name, data) {
            switch (name) {
                case ModelFacet.PROP_ATTITUDE:
                    {
                        this._attitude.yz = data[0];
                        this._attitude.zx = data[1];
                        this._attitude.xy = data[2];
                        this._attitude.w = data[3];
                    }
                    break;
                case ModelFacet.PROP_POSITION:
                    {
                        this._position.set(data[0], data[1], data[2]);
                    }
                    break;
                default: {
                    console.warn("ModelFacet.setProperty " + name);
                }
            }
        };
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         */
        ModelFacet.prototype.setUniforms = function (visitor, canvasId) {
            if (!this.position) {
                console.warn("setUniforms called on zombie ModelFacet");
                return;
            }
            if (this._position.modified) {
                this.T.translation(this._position);
                this._position.modified = false;
            }
            if (this._attitude.modified) {
                this.R.rotation(this._attitude);
                this._attitude.modified = false;
            }
            if (this.scaleXYZ.modified) {
                this.S.scaling(this.scaleXYZ);
                this.scaleXYZ.modified = false;
            }
            this.M.copy(this.T).multiply(this.R).multiply(this.S);
            this.N.normalFromMatrix4(this.M);
            visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.M, canvasId);
            visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.N, canvasId);
        };
        ModelFacet.prototype.incRef = function () {
            this.addRef();
            return this;
        };
        ModelFacet.prototype.decRef = function () {
            this.release();
            return this;
        };
        ModelFacet.PROP_ATTITUDE = 'attitude';
        ModelFacet.PROP_POSITION = 'position';
        return ModelFacet;
    })(Shareable);
    return ModelFacet;
});
