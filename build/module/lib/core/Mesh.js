import { __extends } from "tslib";
import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';
import { ColorFacet } from '../facets/ColorFacet';
import { ModelFacet } from '../facets/ModelFacet';
import { TextureFacet } from '../facets/TextureFacet';
import { notSupported } from '../i18n/notSupported';
import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';
import { quadVectorE3 } from '../math/quadVectorE3';
import { vectorCopy } from '../math/R3';
import { Spinor3 } from '../math/Spinor3';
import { Drawable } from './Drawable';
import { referenceAxis } from './referenceAxis';
import { referenceMeridian } from './referenceMeridian';
/**
 * @hidden
 */
var COLOR_FACET_NAME = 'color';
/**
 * @hidden
 */
var TEXTURE_FACET_NAME = 'image';
/**
 * @hidden
 */
var MODEL_FACET_NAME = 'model';
/**
 * The standard pairing of a Geometry and a Material.
 */
var Mesh = /** @class */ (function (_super) {
    __extends(Mesh, _super);
    /**
     * Initializes this Mesh with a ColorFacet ('color'), a TextureFacet ('image'), and a ModelFacet ('model').
     *
     * @param geometry An optional Geometry, which may be supplied later.
     * @param material An optional Material, which may be supplied later.
     * @param contextManager
     * @param options
     * @param levelUp The zero-based level of this instance in an inheritance hierarchy.
     */
    function Mesh(geometry, material, contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, geometry, material, contextManager, levelUp + 1) || this;
        /**
         * Scratch variable for intermediate calculation value.
         * This can probably be raised to a module level constant.
         */
        _this.canonicalScale = Matrix4.one.clone();
        _this.setLoggingName('Mesh');
        _this.setFacet(COLOR_FACET_NAME, new ColorFacet());
        var textureFacet = new TextureFacet();
        _this.setFacet(TEXTURE_FACET_NAME, textureFacet);
        textureFacet.release();
        _this.setFacet(MODEL_FACET_NAME, new ModelFacet());
        _this.referenceAxis = referenceAxis(options, canonicalAxis).direction();
        _this.referenceMeridian = referenceMeridian(options, canonicalMeridian).rejectionFrom(_this.referenceAxis).direction();
        var tilt = Geometric3.rotorFromFrameToFrame([canonicalAxis, canonicalMeridian, canonicalAxis.cross(canonicalMeridian)], [_this.referenceAxis, _this.referenceMeridian, _this.referenceAxis.cross(_this.referenceMeridian)]);
        if (tilt && !Spinor3.isOne(tilt)) {
            _this.Kidentity = false;
            _this.K = Matrix4.one.clone();
            _this.K.rotation(tilt);
            _this.Kinv = Matrix4.one.clone();
            _this.Kinv.copy(_this.K).inv();
        }
        else {
            _this.Kidentity = true;
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     * @hidden
     */
    Mesh.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Mesh.prototype, "attitude", {
        /**
         * Attitude (spinor). This is an alias for the R property.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.R;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (spinor) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.R.copySpinor(spinor);
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "R", {
        /**
         * Attitude (spinor). This is an alias for the attitude property.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.R;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (spinor) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.R.copySpinor(spinor);
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "color", {
        /**
         * Color
         */
        get: function () {
            var facet = this.getFacet(COLOR_FACET_NAME);
            if (facet) {
                return facet.color;
            }
            else {
                throw new Error(notSupported(COLOR_FACET_NAME).message);
            }
        },
        set: function (color) {
            var facet = this.getFacet(COLOR_FACET_NAME);
            if (facet) {
                facet.color.copy(color);
            }
            else {
                throw new Error(notSupported(COLOR_FACET_NAME).message);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "texture", {
        /**
         * Texture (image).
         */
        get: function () {
            var facet = this.getFacet(TEXTURE_FACET_NAME);
            if (facet) {
                var texture = facet.texture;
                facet.release();
                return texture;
            }
            else {
                throw new Error(notSupported(TEXTURE_FACET_NAME).message);
            }
        },
        set: function (value) {
            var facet = this.getFacet(TEXTURE_FACET_NAME);
            if (facet) {
                facet.texture = value;
                facet.release();
            }
            else {
                throw new Error(notSupported(TEXTURE_FACET_NAME).message);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "X", {
        /**
         * Position (vector). This is an alias for the position property.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.X;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (vector) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.X.copyVector(vector);
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "position", {
        /**
         * Position (vector). This is an alias for the X property.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.X;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (vector) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.X.copyVector(vector);
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "stress", {
        /**
         * Stress (tensor)
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.stress;
            }
            else {
                throw new Error(notSupported('stress').message);
            }
        },
        set: function (stress) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.stress.copy(stress);
            }
            else {
                throw new Error(notSupported('stress').message);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @param i The row index (zero-based).
     * @param j The column index (zero-based).
     * @returns The ij th element of the stress matrix (possibly Kinv * stress * K).
     */
    Mesh.prototype.getScale = function (i, j) {
        if (this.Kidentity) {
            return this.stress.getElement(i, j);
        }
        else {
            var cMatrix = this.canonicalScale;
            cMatrix.copy(this.Kinv).mul(this.stress).mul(this.K);
            return cMatrix.getElement(i, j);
        }
    };
    /**
     * @hidden
     */
    Mesh.prototype.getScaleX = function () {
        return this.getScale(0, 0);
    };
    /**
     * @hidden
     */
    Mesh.prototype.getScaleY = function () {
        return this.getScale(1, 1);
    };
    /**
     * @hidden
     */
    Mesh.prototype.getScaleZ = function () {
        return this.getScale(2, 2);
    };
    /**
     * Implementations of setPrincipalScale are expected to call this method.
     * @hidden
     */
    Mesh.prototype.setScale = function (x, y, z) {
        if (this.Kidentity) {
            var sMatrix = this.stress;
            var oldX = sMatrix.getElement(0, 0);
            var oldY = sMatrix.getElement(1, 1);
            var oldZ = sMatrix.getElement(2, 2);
            if (x !== oldX) {
                sMatrix.setElement(0, 0, x);
            }
            if (y !== oldY) {
                sMatrix.setElement(1, 1, y);
            }
            if (z !== oldZ) {
                sMatrix.setElement(2, 2, z);
            }
        }
        else {
            var sMatrix = this.stress;
            var cMatrix = this.canonicalScale;
            cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
            var oldX = cMatrix.getElement(0, 0);
            var oldY = cMatrix.getElement(1, 1);
            var oldZ = cMatrix.getElement(2, 2);
            var matrixChanged = false;
            if (x !== oldX) {
                cMatrix.setElement(0, 0, x);
                matrixChanged = true;
            }
            if (y !== oldY) {
                cMatrix.setElement(1, 1, y);
                matrixChanged = true;
            }
            if (z !== oldZ) {
                cMatrix.setElement(2, 2, z);
                matrixChanged = true;
            }
            if (matrixChanged) {
                sMatrix.copy(this.K).mul(cMatrix).mul(this.Kinv);
            }
        }
    };
    /**
     * Implementation of the axis (get) property.
     * Derived classes may overide to perform scaling.
     * @hidden
     */
    Mesh.prototype.getAxis = function () {
        return this.referenceAxis.rotate(this.attitude);
    };
    /**
     * @hidden
     * Implementation of the axis (set) property.
     * The result is independent of the magnitude of the `axis` parameter.
     * Derived classes may overide to perform scaling.
     *
     * @param axis
     */
    Mesh.prototype.setAxis = function (axis) {
        var squaredNorm = quadVectorE3(axis);
        if (squaredNorm > 0) {
            this.attitude.rotorFromDirections(this.referenceAxis, axis);
        }
        else {
            // The axis direction is undefined.
            this.attitude.one();
        }
    };
    Object.defineProperty(Mesh.prototype, "axis", {
        /**
         * The current axis (unit vector) of the mesh.
         */
        get: function () {
            return this.getAxis();
        },
        set: function (axis) {
            this.setAxis(axis);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @hidden
     */
    Mesh.prototype.getMeridian = function () {
        return this.referenceMeridian.rotate(this.attitude);
    };
    Object.defineProperty(Mesh.prototype, "meridian", {
        /**
         * The current meridian (unit vector) of the mesh.
         */
        get: function () {
            return this.getMeridian();
        },
        set: function (value) {
            var meridian = vectorCopy(value).rejectionFrom(this.axis).direction();
            var B = Geometric3.dualOfVector(this.axis);
            var R = Geometric3.rotorFromVectorToVector(this.meridian, meridian, B);
            this.attitude.mul2(R, this.attitude);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "modelMatrixUniformName", {
        /**
         * The name of the uniform mat4 variable in the vertex shader that receives the model matrix value.
         * The default name is `uModel`.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.modelMatrixUniformName;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (name) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.modelMatrixUniformName = name;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mesh.prototype, "normalMatrixUniformName", {
        /**
         * The name of the uniform mat3 variable in the vertex shader that receives the normal matrix value.
         * The default name is `uNormal`.
         */
        get: function () {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                return facet.normalMatrixUniformName;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        set: function (name) {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
                facet.normalMatrixUniformName = name;
            }
            else {
                throw new Error(notSupported(MODEL_FACET_NAME).message);
            }
        },
        enumerable: false,
        configurable: true
    });
    return Mesh;
}(Drawable));
export { Mesh };
