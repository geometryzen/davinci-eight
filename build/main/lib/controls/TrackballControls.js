"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Spinor3_1 = require("../math/Spinor3");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
var ViewControls_1 = require("./ViewControls");
/**
 * <p>
 * Allows a camera to be manipulated using mouse controls.
 * </p>
 *
 *     // The trackball controls a view implementation such as a camera.
 *     const camera = new EIGHT.PerspectiveCamera()
 *
 *     // Create TrackballControls anytime.
 *     const controls = new EIGHT.TrackballControls(camera)
 *
 *     // Subscribe to mouse events, usually in the window.onload function.
 *     controls.subscribe(canvas)
 *
 *     // Update the camera position, usually in the animate function.
 *     controls.update()
 *
 *     // Stop listening to mouse events.
 *     controls.unsubscribe()
 *
 *     // Inform the controls they are no longer needed, usually in the window.onunload function.
 *     controls.release()
 *
 * You may decide to update directional lighting to synchronize with the camera.
 */
var TrackballControls = /** @class */ (function (_super) {
    tslib_1.__extends(TrackballControls, _super);
    /**
     *
     * @param view eye, look, and up vectors. The coordinates will be manipulated by this object.
     * @param wnd The browser window. Used to add listeners for mouse and keyboard events.
     */
    function TrackballControls(view, wnd) {
        if (wnd === void 0) { wnd = window; }
        var _this = _super.call(this, view, wnd) || this;
        // Working storage for calculations that update the camera.
        _this.moveDirection = new Vector3_1.Vector3();
        _this.eyeMinusLookDirection = new Vector3_1.Vector3();
        _this.objectUpDirection = new Vector3_1.Vector3();
        _this.objectSidewaysDirection = new Vector3_1.Vector3();
        /**
         * The bivector for a rotation.
         */
        _this.B = Spinor3_1.Spinor3.zero.clone();
        _this.rotor = Spinor3_1.Spinor3.one.clone();
        _this.mouseChange = new Vector2_1.Vector2();
        _this.pan = new Vector3_1.Vector3();
        _this.objectUp = new Vector3_1.Vector3();
        _this.setLoggingName('TrackballControls');
        return _this;
    }
    TrackballControls.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    TrackballControls.prototype.rotateCamera = function () {
        if (this.hasView()) {
            this.moveDirection.setXYZ(this.moveCurr.x - this.movePrev.x, this.moveCurr.y - this.movePrev.y, 0);
            var Δs = this.moveDirection.magnitude();
            if (Δs > 0) {
                var ψ = Δs * 2 * Math.PI * this.rotateSpeed;
                this.eyeMinusLookDirection.copy(this.eyeMinusLook).normalize();
                // Compute the unit vector pointing in the camera up direction.
                // We assume (and maintain) that the up direction is aligned with e2 in the mouse coordinate frame.
                this.objectUpDirection.copy(this.up).normalize();
                // Compute the unit vector pointing to the viewers right.
                this.objectSidewaysDirection.copy(this.objectUpDirection).cross(this.eyeMinusLookDirection);
                // Scale these unit vectors (ahem) according to the mouse movements.
                this.objectUpDirection.scale(this.moveCurr.y - this.movePrev.y);
                this.objectSidewaysDirection.scale(this.moveCurr.x - this.movePrev.x);
                // Compute the move direction from the components.
                this.moveDirection.copy(this.objectUpDirection).add(this.objectSidewaysDirection).normalize();
                // Compute the axis of rotation. This computation appears to be off by a sign (-1), but
                // that's because the camera will move while the scene stays still.
                this.B.wedge(this.moveDirection, this.eyeMinusLookDirection).normalize();
                // Compute the rotor for rotating the eye vector.
                this.rotor.rotorFromGeneratorAngle(this.B, ψ);
                // Move the viewing point relative to the target.
                this.eyeMinusLook.rotate(this.rotor);
                // Here's where we maintain the camera's up vector in the viewing plane.
                // It seems inconsistent that we affect the camera.up vector, but not the camera.position.
                // That's probably because we are going to combine pan and zoom.
                this.up.rotate(this.rotor);
                this.movePrev.copy(this.moveCurr);
            }
        }
    };
    /**
     *
     */
    TrackballControls.prototype.panCamera = function () {
        if (this.hasView()) {
            this.mouseChange.copy(this.panEnd).sub(this.panStart);
            if (this.mouseChange.squaredNorm()) {
                this.mouseChange.scale(this.eyeMinusLook.magnitude() * this.panSpeed);
                this.pan.copy(this.eyeMinusLook).cross(this.up).normalize().scale(this.mouseChange.x);
                this.objectUp.copy(this.up).normalize().scale(this.mouseChange.y);
                this.pan.add(this.objectUp);
                this.look.add(this.pan);
                this.panStart.copy(this.panEnd);
            }
        }
    };
    return TrackballControls;
}(ViewControls_1.ViewControls));
exports.TrackballControls = TrackballControls;
