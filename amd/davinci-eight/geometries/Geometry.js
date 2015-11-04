define(["require", "exports", '../math/CartesianE3', '../checks/mustBeBoolean', '../checks/mustBeObject'], function (require, exports, CartesianE3, mustBeBoolean, mustBeObject) {
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
             * @type {CartesianE3}
             * @private
             */
            this._position = CartesianE3.zero;
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
             * @type {CartesianE3}
             */
            get: function () {
                return this._position;
            },
            set: function (position) {
                this.setPosition(position);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method enableTextureCoords
         * @param enable {boolean}
         * @return {Geometry}
         * @chainable
         */
        Geometry.prototype.enableTextureCoords = function (enable) {
            mustBeBoolean('enable', enable);
            this.useTextureCoords = enable;
            return this;
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return Geometry
         * @chainable
         */
        Geometry.prototype.setPosition = function (position) {
            mustBeObject('position', position);
            this._position = CartesianE3.fromVectorE3(position);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        Geometry.prototype.toPrimitives = function () {
            console.warn("Geometry.toPrimitives() must be implemented by derived classes.");
            return [];
        };
        return Geometry;
    })();
    return Geometry;
});
