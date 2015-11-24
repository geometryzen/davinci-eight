var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Mat3R', '../math/Mat4R', '../models/ModelE3', '../checks/mustBeString', '../math/R3', '../i18n/readOnly', '../core/GraphicsProgramSymbols'], function (require, exports, Mat3R, Mat4R, ModelE3, mustBeString, R3, readOnly, GraphicsProgramSymbols) {
    /**
     * @class ModelFacetE3
     */
    var ModelFacetE3 = (function (_super) {
        __extends(ModelFacetE3, _super);
        /**
         * <p>
         * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
         * </p>
         * <p>
         * In Physics, the drawable object may represent a rigid body.
         * In Computer Graphics, the drawable object is a collection of drawing primitives.
         * </p>
         * <p>
         * ModelFacetE3 implements IFacet required for manipulating a drawable object.
         * </p>
         * <p>
         * Constructs a ModelFacetE3 at the origin and with unity attitude.
         * </p>
         * @class ModelFacetE3
         * @constructor
         * @param type [string = 'ModelFacetE3'] The name used for reference counting.
         */
        function ModelFacetE3(type) {
            if (type === void 0) { type = 'ModelFacetE3'; }
            _super.call(this, mustBeString('type', type));
            // FIXME: I don't like this non-geometric scaling.
            this._scaleXYZ = new R3([1, 1, 1]);
            this.matM = Mat4R.one();
            this.matN = Mat3R.one();
            this.matR = Mat4R.one();
            this.matS = Mat4R.one();
            this.matT = Mat4R.one();
            this._scaleXYZ.modified = true;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ModelFacetE3.prototype.destructor = function () {
            this._scaleXYZ = void 0;
            this.matM = void 0;
            this.matN = void 0;
            this.matR = void 0;
            this.matS = void 0;
            this.matT = void 0;
            _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ModelFacetE3.prototype, "scaleXYZ", {
            /**
             * @property scaleXYZ
             * @type R3
             * @readOnly
             */
            get: function () {
                return this._scaleXYZ;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelFacetE3.PROP_SCALEXYZ).message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setUniforms
         * @param visitor {IFacetVisitor}
         * @param canvasId {number}
         */
        ModelFacetE3.prototype.setUniforms = function (visitor, canvasId) {
            if (this.X.modified) {
                this.matT.translation(this.X);
                this.X.modified = false;
            }
            if (this.R.modified) {
                this.matR.rotation(this.R);
                this.R.modified = false;
            }
            if (this.scaleXYZ.modified) {
                this.matS.scaling(this.scaleXYZ);
                this.scaleXYZ.modified = false;
            }
            this.matM.copy(this.matT).mul(this.matR).mul(this.matS);
            this.matN.normalFromMat4R(this.matM);
            visitor.mat4(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, this.matM, false, canvasId);
            visitor.mat3(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, this.matN, false, canvasId);
        };
        /**
         * @method incRef
         * @return {ModelFacetE3}
         * @chainable
         */
        ModelFacetE3.prototype.incRef = function () {
            this.addRef();
            return this;
        };
        /**
         * @method decRef
         * @return {ModelFacetE3}
         * @chainable
         */
        ModelFacetE3.prototype.decRef = function () {
            this.release();
            return this;
        };
        // FIXME: Make this scale so that we can be geometric?
        ModelFacetE3.PROP_SCALEXYZ = 'scaleXYZ';
        return ModelFacetE3;
    })(ModelE3);
    return ModelFacetE3;
});