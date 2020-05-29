"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrbitControls = void 0;
var tslib_1 = require("tslib");
var Geometric3_1 = require("../math/Geometric3");
var getViewAttitude_1 = require("../facets/getViewAttitude");
var Spinor3_1 = require("../math/Spinor3");
var Vector3_1 = require("../math/Vector3");
var ViewControls_1 = require("./ViewControls");
// Scratch variables to aboid creating temporary objects.
var a = Geometric3_1.Geometric3.zero(false);
var b = Geometric3_1.Geometric3.zero(false);
var d = Geometric3_1.Geometric3.zero(false);
var B = Spinor3_1.Spinor3.one.clone();
var R = Spinor3_1.Spinor3.one.clone();
var X = Vector3_1.Vector3.zero();
/**
 * <p>
 * <code>OrbitControls</code> move a camera over a sphere such that the camera up vector
 * remains aligned with the local north vector.
 * </p>
 * <p>
 * For rotations, the final camera position dictates a new camera local reference frame.
 * A rotor may be calculated that rotates the camera from its old reference frame to the
 * new reference frame. This rotor may also be interpolated for animations.
 * </p>
 */
var OrbitControls = /** @class */ (function (_super) {
    tslib_1.__extends(OrbitControls, _super);
    /**
     * @param view
     * @param wnd
     */
    function OrbitControls(view, wnd) {
        if (wnd === void 0) { wnd = window; }
        var _this = _super.call(this, view, wnd) || this;
        _this.setLoggingName('OrbitControls');
        return _this;
    }
    /**
     * @param levelUp
     */
    OrbitControls.prototype.destructor = function (levelUp) {
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    OrbitControls.prototype.rotateCamera = function () {
        if (this.hasView()) {
            var Δs = this.moveCurr.distanceTo(this.movePrev);
            if (Δs > 0) {
                var ψ = Δs * 2 * Math.PI * this.rotateSpeed;
                // We'll need the attitude of the camera in order to convert our mouse motion and
                // vector from the origin to the screen. Reverse the target attitude to get the
                // rotor that we must apply to get the true rotation.
                X.copy(this.eyeMinusLook).add(this.look);
                getViewAttitude_1.getViewAttitude(X, this.look, this.up, R);
                a.zero();
                a.x = this.movePrev.x;
                a.y = this.movePrev.y;
                b.zero();
                b.x = this.moveCurr.x;
                b.y = this.moveCurr.y;
                d.copy(b).sub(a);
                d.rotate(R);
                X.normalize();
                // B = direction(X ^ d)
                B.wedge(X, d).normalize();
                // R is the rotor that moves the camera from its previous position.
                // Notice the plus sign, because the camera moves in the opposite orientation.
                R.copy(B).scale(+ψ / 2).exp();
                this.eyeMinusLook.rotate(R);
            }
        }
        this.movePrev.copy(this.moveCurr);
    };
    return OrbitControls;
}(ViewControls_1.ViewControls));
exports.OrbitControls = OrbitControls;
