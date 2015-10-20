define(["require", "exports", '../checks/mustBeObject', '../math/Vector3'], function (require, exports, mustBeObject, Vector3) {
    /**
     * @class Geometry
     */
    var Geometry = (function () {
        /**
         * @class Geometry
         * @constructor
         */
        function Geometry() {
            /**
             * @property _position
             * @type {Vector3}
             * @private
             */
            this._position = new Vector3();
            /**
             * @property useTextureCoords
             * @type {boolean}
             */
            this.useTextureCoords = false;
        }
        Object.defineProperty(Geometry.prototype, "position", {
            /**
             * <p>
             * The local `position` property used for geometry generation.
             * </p>
             * @property position
             * @type {Cartesian3}
             */
            get: function () {
                return this._position;
            },
            set: function (position) {
                mustBeObject('position', position);
                this._position.copy(position);
            },
            enumerable: true,
            configurable: true
        });
        return Geometry;
    })();
    return Geometry;
});
