import { __extends } from "tslib";
import { Modulo } from '../math/Modulo';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeNumber } from '../checks/mustBeNumber';
import { ShareableBase } from '../core/ShareableBase';
import { TrailConfig } from './TrailConfig';
/**
 * <p>
 * Records the position and attitude history of a <code>Mesh</code> allowing the
 * <code>Mesh</code> to be drawn in multiple historical configurations.
 * <p>
 * <p>
 * This class is refererce counted because it maintains a reference to a <code>Mesh</code>.
 * You should call the <code>release</code> method when the trail is no longer required.
 * </p>
 *
 *
 *     // The trail is constructed, at any time, on an existing mesh.
 *     const trail = new EIGHT.Trail(mesh)
 *
 *     // Configure the Trail object, or use the defaults.
 *     trail.config.enabled = true
 *     trail.config.interval = 30
 *     trail.config.retain = 5
 *
 *     // Take a snapshot of the ball position and attitude, usually each animation frame.
 *     trail.snapshot()
 *
 *     // Draw the trail during the animation frame.
 *     trail.draw(ambients)
 *
 *     // Release the trail when no longer required, usually in the window.onunload function.
 *     trail.release()
 */
var Trail = /** @class */ (function (_super) {
    __extends(Trail, _super);
    /**
     * Constructs a trail for the specified mesh.
     */
    function Trail(mesh) {
        var _this = _super.call(this) || this;
        /**
         * The position history.
         */
        _this.Xs = [];
        /**
         * The attitude history.
         */
        _this.Rs = [];
        /**
         * The parameter history.
         */
        _this.Ns = [];
        /**
         * The configuration that determines how the history is recorded.
         */
        _this.config = new TrailConfig();
        _this.counter = 0;
        _this.modulo = new Modulo();
        _this.setLoggingName('Trail');
        mustBeNonNullObject('mesh', mesh);
        mesh.addRef();
        _this.mesh = mesh;
        return _this;
    }
    /**
     * @hidden
     */
    Trail.prototype.destructor = function (levelUp) {
        this.mesh.release();
        this.mesh = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     * @deprecated. Use the render method instead.
     */
    Trail.prototype.draw = function (ambients) {
        console.warn("Trail.draw is deprecated. Please use the Trail.render method instead.");
        this.render(ambients);
    };
    /**
     * Erases the trail history.
     */
    Trail.prototype.erase = function () {
        this.Ns = [];
        this.Xs = [];
        this.Rs = [];
    };
    Trail.prototype.forEach = function (callback) {
        if (this.config.enabled) {
            var Ns = this.Ns;
            var Xs = this.Xs;
            var Rs = this.Rs;
            var iLength = this.modulo.size;
            for (var i = 0; i < iLength; i++) {
                if (Xs[i] && Rs[i]) {
                    callback(Ns[i], Xs[i], Rs[i]);
                }
            }
        }
    };
    /**
     * Renders the mesh in its historical positions and attitudes.
     */
    Trail.prototype.render = function (ambients) {
        if (this.config.enabled) {
            // Save the mesh position and attitude so that we can restore them later.
            var mesh = this.mesh;
            var X = mesh.X;
            var R = mesh.R;
            // Save the position as efficiently as possible.
            var x = X.x;
            var y = X.y;
            var z = X.z;
            // Save the attitude as efficiently as possible.
            var a = R.a;
            var yz = R.yz;
            var zx = R.zx;
            var xy = R.xy;
            // Work at the Geometry and Material level for efficiency.
            var geometry = mesh.geometry;
            var material = mesh.material;
            material.use();
            var iL = ambients.length;
            for (var i = 0; i < iL; i++) {
                var facet = ambients[i];
                facet.setUniforms(material);
            }
            geometry.bind(material);
            var Xs = this.Xs;
            var Rs = this.Rs;
            var iLength = this.modulo.size;
            for (var i = 0; i < iLength; i++) {
                if (Xs[i]) {
                    X.copyVector(Xs[i]);
                }
                if (Rs[i]) {
                    R.copySpinor(Rs[i]);
                }
                mesh.setUniforms();
                geometry.draw();
            }
            geometry.unbind(material);
            geometry.release();
            material.release();
            // Restore the mesh position and attitude.
            X.x = x;
            X.y = y;
            X.z = z;
            R.a = a;
            R.yz = yz;
            R.zx = zx;
            R.xy = xy;
        }
    };
    /**
     * Records the Mesh variables according to the interval property.
     */
    Trail.prototype.snapshot = function (alpha) {
        if (alpha === void 0) { alpha = 0; }
        mustBeNumber('alpha', alpha);
        if (!this.config.enabled) {
            return;
        }
        if (this.modulo.size !== this.config.retain) {
            this.modulo.size = this.config.retain;
            this.modulo.value = 0;
        }
        if (this.counter % this.config.interval === 0) {
            var index = this.modulo.value;
            this.Ns[index] = alpha;
            if (this.Xs[index]) {
                // When populating an occupied slot, don't create new objects.
                this.Xs[index].copy(this.mesh.X);
                this.Rs[index].copy(this.mesh.R);
            }
            else {
                // When populating an empty slot, allocate a new object and make a copy.
                this.Xs[index] = Vector3.copy(this.mesh.X);
                this.Rs[index] = Spinor3.copy(this.mesh.R);
            }
            this.modulo.inc();
        }
        this.counter++;
    };
    return Trail;
}(ShareableBase));
export { Trail };
