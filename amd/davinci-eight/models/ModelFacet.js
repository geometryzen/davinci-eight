var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../math/Matrix3', '../math/Matrix4', '../checks/mustBeString', '../math/G3', '../math/R3', '../i18n/readOnly', '../utils/Shareable', '../core/Symbolic'], function (require, exports, Euclidean3, Matrix3, Matrix4, mustBeString, G3, R3, readOnly, Shareable, Symbolic) {
    /**
     * @class ModelFacet
     */
    var ModelFacet = (function (_super) {
        __extends(ModelFacet, _super);
        /**
         * <p>
         * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
         * </p>
         * <p>
         * In Physics, the drawable object may represent a rigid body.
         * In Computer Graphics, the drawable object is a collection of drawing primitives.
         * </p>
         * <p>
         * ModelFacet implements IFacet required for manipulating a drawable object.
         * </p>
         * <p>
         * Constructs a ModelFacet at the origin and with unity attitude.
         * </p>
         * @class ModelFacet
         * @constructor
         * @param type [string = 'ModelFacet'] The name used for reference counting.
         */
        function ModelFacet(type) {
            if (type === void 0) { type = 'ModelFacet'; }
            _super.call(this, mustBeString('type', type));
            this._position = new G3().copy(Euclidean3.zero);
            this._attitude = new G3().copy(Euclidean3.one);
            // FIXME: I don't like this non-geometric scaling.
            this._scaleXYZ = new R3([1, 1, 1]);
            this.matM = Matrix4.identity();
            this.matN = Matrix3.identity();
            this.matR = Matrix4.identity();
            this.matS = Matrix4.identity();
            this.matT = Matrix4.identity();
            this._position.modified = true;
            this._attitude.modified = true;
            this._scaleXYZ.modified = true;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ModelFacet.prototype.destructor = function () {
            this._position = void 0;
            this._attitude = void 0;
            this._scaleXYZ = void 0;
            this.matM = void 0;
            this.matN = void 0;
            this.matR = void 0;
            this.matS = void 0;
            this.matT = void 0;
        };
        Object.defineProperty(ModelFacet.prototype, "R", {
            /**
             * <p>
             * The <em>attitude</em>, a unitary spinor.
             * </p>
             * @property R
             * @type G3
             * @readOnly
             */
            get: function () {
                return this._attitude;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelFacet.PROP_ATTITUDE).message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelFacet.prototype, "X", {
            /**
             * <p>
             * The <em>position</em>, a vector.
             * The vector <b>X</b> designates the center of mass of the body (Physics).
             * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
             * </p>
             *
             * @property X
             * @type G3
             * @readOnly
             */
            get: function () {
                return this._position;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelFacet.PROP_POSITION).message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelFacet.prototype, "scaleXYZ", {
            /**
             * @property scaleXYZ
             * @type R3
             * @readOnly
             */
            get: function () {
                return this._scaleXYZ;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelFacet.PROP_SCALEXYZ).message);
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
                    return [this._attitude.yz, this._attitude.zx, this._attitude.xy, this._attitude.α];
                }
                case ModelFacet.PROP_POSITION: {
                    return [this._position.x, this._position.y, this._position.z];
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
                        this._attitude.zero();
                        this._attitude.yz = data[0];
                        this._attitude.zx = data[1];
                        this._attitude.xy = data[2];
                        this._attitude.α = data[3];
                    }
                    break;
                case ModelFacet.PROP_POSITION:
                    {
                        this._position.zero();
                        this._position.x = data[0];
                        this._position.y = data[1];
                        this._position.z = data[2];
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
            if (this._position.modified) {
                this.matT.translation(this._position);
                this._position.modified = false;
            }
            if (this._attitude.modified) {
                this.matR.rotation(this._attitude);
                this._attitude.modified = false;
            }
            if (this.scaleXYZ.modified) {
                this.matS.scaling(this.scaleXYZ);
                this.scaleXYZ.modified = false;
            }
            this.matM.copy(this.matT).mul(this.matR).mul(this.matS);
            this.matN.normalFromMatrix4(this.matM);
            visitor.uniformMatrix4(Symbolic.UNIFORM_MODEL_MATRIX, false, this.matM, canvasId);
            visitor.uniformMatrix3(Symbolic.UNIFORM_NORMAL_MATRIX, false, this.matN, canvasId);
        };
        /**
         * @method incRef
         * @return {ModelFacet}
         * @chainable
         */
        ModelFacet.prototype.incRef = function () {
            this.addRef();
            return this;
        };
        /**
         * @method decRef
         * @return {ModelFacet}
         * @chainable
         */
        ModelFacet.prototype.decRef = function () {
            this.release();
            return this;
        };
        /**
         * The name of the property that designates the attitude.
         * @property PROP_ATTITUDE
         * @type {string}
         * @default 'R'
         * @static
         * @readOnly
         */
        ModelFacet.PROP_ATTITUDE = 'R';
        /**
         * The name of the property that designates the position.
         * @property PROP_POSITION
         * @type {string}
         * @default 'X'
         * @static
         * @readOnly
         */
        ModelFacet.PROP_POSITION = 'X';
        // FIXME: Make this scale so that we can be geometric?
        ModelFacet.PROP_SCALEXYZ = 'scaleXYZ';
        return ModelFacet;
    })(Shareable);
    return ModelFacet;
});
