"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerspectiveTransform = void 0;
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Matrix4_1 = require("../math/Matrix4");
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeLE_1 = require("../checks/mustBeLE");
var mustBeNumber_1 = require("../checks/mustBeNumber");
/**
 *
 */
var PerspectiveTransform = /** @class */ (function () {
    /**
     *
     */
    function PerspectiveTransform(fov, aspect, near, far) {
        if (fov === void 0) { fov = 45 * Math.PI / 180; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 1000; }
        /**
         *
         */
        this.matrix = Matrix4_1.Matrix4.one.clone();
        /**
         *
         */
        this.matrixName = GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX;
        this._fov = fov;
        this._aspect = aspect;
        this._near = near;
        this._far = far;
        this.refreshMatrix();
    }
    Object.defineProperty(PerspectiveTransform.prototype, "aspect", {
        /**
         * The aspect ratio (width / height) of the camera viewport.
         */
        get: function () {
            return this._aspect;
        },
        set: function (aspect) {
            if (this._aspect !== aspect) {
                mustBeNumber_1.mustBeNumber('aspect', aspect);
                mustBeGE_1.mustBeGE('aspect', aspect, 0);
                this._aspect = aspect;
                this.refreshMatrix();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveTransform.prototype, "fov", {
        /**
         * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
         * Measured in radians.
         */
        get: function () {
            return this._fov;
        },
        set: function (fov) {
            if (this._fov !== fov) {
                mustBeNumber_1.mustBeNumber('fov', fov);
                mustBeGE_1.mustBeGE('fov', fov, 0);
                mustBeLE_1.mustBeLE('fov', fov, Math.PI);
                this._fov = fov;
                this.refreshMatrix();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveTransform.prototype, "near", {
        /**
         * The distance to the near plane.
         */
        get: function () {
            return this._near;
        },
        set: function (near) {
            if (this._near !== near) {
                mustBeNumber_1.mustBeNumber('near', near);
                mustBeGE_1.mustBeGE('near', near, 0);
                this._near = near;
                this.refreshMatrix();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PerspectiveTransform.prototype, "far", {
        /**
         * The distance to the far plane.
         */
        get: function () {
            return this._far;
        },
        set: function (far) {
            if (this._far !== far) {
                mustBeNumber_1.mustBeNumber('far', far);
                mustBeGE_1.mustBeGE('far', far, 0);
                this._far = far;
                this.refreshMatrix();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    PerspectiveTransform.prototype.setUniforms = function (visitor) {
        visitor.matrix4fv(this.matrixName, this.matrix.elements, false);
    };
    Object.defineProperty(PerspectiveTransform.prototype, "projectionMatrixUniformName", {
        /**
         * The name of the uniform mat4 variable in the vertex shader that receives the projection matrix value.
         * The default name is `uProjection`.
         */
        get: function () {
            return this.matrixName;
        },
        set: function (name) {
            this.matrixName = name;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Converts from image cube coordinates to camera coordinates.
     * This method performs the inverse of the perspective transformation.
     */
    PerspectiveTransform.prototype.imageToCameraCoords = function (x, y, z) {
        /**
         * Near plane distance.
         */
        var n = this.near;
        /**
         * Far plane distance.
         */
        var f = this.far;
        /**
         * Difference of f and n.
         */
        var d = f - n;
        /**
         * Sum of f and n.
         */
        var s = f + n;
        /**
         * Homogeneous coordinates weight.
         */
        var weight = (s - d * z) / (2 * f * n);
        var t = Math.tan(this.fov / 2);
        var u = this.aspect * t * x / weight;
        var v = t * y / weight;
        var w = -1 / weight;
        return [u, v, w];
    };
    /**
     *
     */
    PerspectiveTransform.prototype.refreshMatrix = function () {
        this.matrix.perspective(this._fov, this._aspect, this._near, this._far);
    };
    return PerspectiveTransform;
}());
exports.PerspectiveTransform = PerspectiveTransform;
