"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewControls = void 0;
var tslib_1 = require("tslib");
var MouseControls_1 = require("./MouseControls");
var Vector3_1 = require("../math/Vector3");
/**
 *
 */
var ViewControls = /** @class */ (function (_super) {
    tslib_1.__extends(ViewControls, _super);
    /**
     * @param view
     * @param wnd
     */
    function ViewControls(view, wnd) {
        if (wnd === void 0) { wnd = window; }
        var _this = _super.call(this, wnd) || this;
        /**
         *
         * @default 1
         */
        _this.rotateSpeed = 1;
        /**
         *
         * @default 1
         */
        _this.zoomSpeed = 1;
        /**
         *
         * @default 1
         */
        _this.panSpeed = 1;
        /**
         * The view.eye value when the view was acquired by this view controller.
         */
        _this.eye0 = Vector3_1.Vector3.vector(0, 0, 1);
        /**
         * The view.look value when the view was acquired by this view controller.
         */
        _this.look0 = Vector3_1.Vector3.zero();
        /**
         * The view.up value when the view was acquired by this view controller.
         */
        _this.up0 = Vector3_1.Vector3.vector(0, 1, 0);
        /**
         *
         */
        _this.eyeMinusLook = new Vector3_1.Vector3();
        /**
         *
         */
        _this.look = new Vector3_1.Vector3();
        /**
         *
         */
        _this.up = new Vector3_1.Vector3();
        _this.setLoggingName('ViewControls');
        _this.setView(view);
        return _this;
    }
    ViewControls.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     * @returns
     */
    ViewControls.prototype.hasView = function () {
        return !!this.view;
    };
    /**
     * This should be called inside the animation frame to update the camera location.
     * Notice that the movement of the mouse controls is decoupled from the effect.
     * We also want to avoid temporary object creation in this and called methods by recycling variables.
     */
    ViewControls.prototype.update = function () {
        if (this.view) {
            this.eyeMinusLook.copy(this.view.eye).sub(this.view.look);
            this.look.copy(this.view.look);
            this.up.copy(this.view.up);
            if (!this.noRotate) {
                this.rotateCamera();
            }
            if (!this.noZoom) {
                this.zoomCamera();
            }
            if (!this.noPan) {
                this.panCamera();
            }
            this.view.eye.x = this.look.x + this.eyeMinusLook.x;
            this.view.eye.y = this.look.y + this.eyeMinusLook.y;
            this.view.eye.z = this.look.z + this.eyeMinusLook.z;
            this.view.look.x = this.look.x;
            this.view.look.y = this.look.y;
            this.view.look.z = this.look.z;
            this.view.up.x = this.up.x;
            this.view.up.y = this.up.y;
            this.view.up.z = this.up.z;
        }
    };
    /**
     *
     */
    ViewControls.prototype.rotateCamera = function () {
        // Do nothing.
    };
    /**
     *
     */
    ViewControls.prototype.zoomCamera = function () {
        var factor = 1 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed;
        if (factor !== 1 && factor > 0) {
            this.eyeMinusLook.scale(factor);
            this.zoomStart.copy(this.zoomEnd);
        }
    };
    /**
     *
     */
    ViewControls.prototype.panCamera = function () {
        // Do nothing
    };
    /**
     *
     */
    ViewControls.prototype.reset = function () {
        if (this.view) {
            this.view.eye.x = this.eye0.x;
            this.view.eye.y = this.eye0.y;
            this.view.eye.z = this.eye0.z;
            this.view.look.x = this.look0.x;
            this.view.look.y = this.look0.y;
            this.view.look.z = this.look0.z;
            this.view.up.x = this.up0.x;
            this.view.up.y = this.up0.y;
            this.view.up.z = this.up0.z;
        }
        _super.prototype.reset.call(this);
    };
    /**
     * @param view
     */
    ViewControls.prototype.setView = function (view) {
        if (view) {
            this.view = view;
        }
        else {
            this.view = void 0;
        }
        this.synchronize();
    };
    /**
     *
     */
    ViewControls.prototype.synchronize = function () {
        var view = this.view;
        if (view) {
            this.eye0.copy(view.eye);
            this.look0.copy(view.look);
            this.up0.copy(view.up);
        }
        else {
            this.eye0.setXYZ(0, 0, 1);
            this.look0.zero();
            this.up0.setXYZ(0, 1, 0);
        }
    };
    return ViewControls;
}(MouseControls_1.MouseControls));
exports.ViewControls = ViewControls;
