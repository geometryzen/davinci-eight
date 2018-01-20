"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Matrix3_1 = require("../math/Matrix3");
var Matrix4_1 = require("../math/Matrix4");
var ModelE3_1 = require("./ModelE3");
var mustBeObject_1 = require("../checks/mustBeObject");
var readOnly_1 = require("../i18n/readOnly");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
/**
 *
 */
var ModelFacet = /** @class */ (function (_super) {
    tslib_1.__extends(ModelFacet, _super);
    /**
     * <p>
     * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
     * </p>
     * <p>
     * In Physics, the composite object may represent a rigid body.
     * In Computer Graphics, the composite object is a collection of drawing primitives.
     * </p>
     * <p>
     * ModelFacet implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelFacet at the origin and with unity attitude.
     * </p>
     */
    function ModelFacet() {
        var _this = _super.call(this) || this;
        /**
         * @default diag(1, 1, 1, 1)
         */
        _this.matS = Matrix4_1.Matrix4.one.clone();
        _this._matM = Matrix4_1.Matrix4.one.clone();
        _this._matN = Matrix3_1.Matrix3.one.clone();
        _this.matR = Matrix4_1.Matrix4.one.clone();
        _this.matT = Matrix4_1.Matrix4.one.clone();
        /**
         * The name used for the model matrix in the vertex shader.
         */
        _this.nameM = GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX;
        /**
         * The name used for the normal matrix in the vertex shader.
         */
        _this.nameN = GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX;
        _this.X.modified = true;
        _this.R.modified = true;
        _this.matS.modified = true;
        return _this;
    }
    Object.defineProperty(ModelFacet.prototype, "stress", {
        /**
         * Stress (tensor)
         */
        get: function () {
            return this.matS;
        },
        set: function (stress) {
            mustBeObject_1.mustBeObject('stress', stress);
            this.matS.copy(stress);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelFacet.prototype, "matrix", {
        /**
         * @readOnly
         */
        get: function () {
            return this._matM;
        },
        set: function (unused) {
            throw new Error(readOnly_1.readOnly('matrix').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelFacet.prototype, "modelMatrixUniformName", {
        /**
         * The name of the uniform variable in the vertex shader that receives the model matrix value.
         */
        get: function () {
            return this.nameM;
        },
        set: function (name) {
            this.nameM = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModelFacet.prototype, "normalMatrixUniformName", {
        /**
         * The name of the uniform variable in the vertex shader that receives the normal matrix value.
         */
        get: function () {
            return this.nameN;
        },
        set: function (name) {
            this.nameN = name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ModelFacet.prototype.setUniforms = function (visitor) {
        this.updateMatrices();
        visitor.matrix4fv(this.nameM, this._matM.elements, false);
        visitor.matrix3fv(this.nameN, this._matN.elements, false);
    };
    ModelFacet.prototype.updateMatrices = function () {
        var modified = false;
        if (this.X.modified) {
            this.matT.translation(this.X);
            this.X.modified = false;
            modified = true;
        }
        if (this.R.modified) {
            this.matR.rotation(this.R);
            this.R.modified = false;
            modified = true;
        }
        if (this.matS.modified) {
            modified = true;
        }
        if (modified) {
            this._matM.copy(this.matT).mul(this.matR).mul(this.matS);
            if (this._matM.det() !== 0) {
                this._matN.normalFromMatrix4(this._matM);
            }
            else {
                // If the scaling matrix determinant is zero, so too will be the matrix M.
                // If M is singular then it will not be possible to compute the matrix for transforming normals.
                // In any case, the geometry not be visible.
                // So we just set the normals matrix to the identity.
                this._matN.one();
            }
        }
    };
    return ModelFacet;
}(ModelE3_1.ModelE3));
exports.ModelFacet = ModelFacet;
