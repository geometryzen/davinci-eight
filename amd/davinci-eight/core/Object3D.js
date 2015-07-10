define(["require", "exports", '../math/Vector3', '../math/Spinor3'], function (require, exports, Vector3, Spinor3) {
    /**
     * Temporary vector used in calculations.
     */
    var v1 = new Vector3();
    /**
     * @class Object3D
     */
    var Object3D = (function () {
        /**
         * @constructor
         */
        function Object3D() {
            /**
             * Object's parent in the tree of objects.
             * @property parent
             * @type [Object3D]
             * @default null
             */
            this._parent = null;
            /**
             * Array with Object's children.
             * @property children
             * @type Object3D[]
             * @default []
             */
            this.children = [];
            /**
             * Object's local position.
             * @property position
             * @type Vector3
             * @default Vector3()
             */
            this.position = new Vector3();
            /**
             * Object's local attitude.
             * @property attitude
             * @type Spinor3
             * @default Spinor3()
             */
            this.attitude = new Spinor3();
        }
        Object.defineProperty(Object3D.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Translate the object by distance along an axis in object space. The axis is assumed to be normalized.
         * @method translateOnAxis
         * @param axis {Vector3}
         * @param distance {Number}
         */
        Object3D.prototype.translateOnAxis = function (axis, distance) {
            v1.copy(axis).applySpinor(this.attitude);
            this.position.add(v1.multiplyScalar(distance));
            return this;
        };
        return Object3D;
    })();
    return Object3D;
});
