var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../i18n/readOnly', '../utils/Shareable', '../math/Spinor3', '../math/Vector3'], function (require, exports, readOnly, Shareable, Spinor3, Vector3) {
    // The `type` property when this class is being used concretely.
    var TYPE_RIGID_BODY_3 = 'RigidBody3';
    /**
     * A model for a rigid body in 3-dimensional space.
     * This class may be used concretely or extended.
     * @class RigidBody3
     */
    var RigidBody3 = (function (_super) {
        __extends(RigidBody3, _super);
        /**
         * The `attitude` is initialized to the default for `Spinor3`.
         * The `position` is initialized to the default for `Vector3`.
         * This class assumes that it is being used concretely if the type is 'RigidBody3'.
         * @class RigidBody3
         * @constructor
         * @param type {string} The class name of the derived class. Defaults to 'RigidBody3'.
         */
        function RigidBody3(type) {
            if (type === void 0) { type = 'RigidBody3'; }
            _super.call(this, type);
            this._attitude = new Spinor3();
            this._position = new Vector3();
        }
        RigidBody3.prototype.destructor = function () {
            if (this._type !== TYPE_RIGID_BODY_3) {
                console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
            }
            this._attitude = void 0;
            this._position = void 0;
        };
        Object.defineProperty(RigidBody3.prototype, "attitude", {
            /**
             * The attitude spinor of the rigid body.
             * @property attitude
             * @type Spinor3
             * @readonly
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
        Object.defineProperty(RigidBody3.prototype, "position", {
            /**
             * The position vector of the rigid body.
             * @property position
             * @type Vector3
             * @readonly
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
        return RigidBody3;
    })(Shareable);
    return RigidBody3;
});
