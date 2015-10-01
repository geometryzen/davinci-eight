var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable', '../core/Symbolic', '../math/Vector3'], function (require, exports, Shareable, Symbolic, Vector3) {
    /**
     * @class ColorFacet.
     */
    var ColorFacet = (function (_super) {
        __extends(ColorFacet, _super);
        /**
         * @class ColorFacet
         * @constructor
         * @param [name = Symbolic.UNIFORM_COLOR]
         */
        function ColorFacet(name) {
            if (name === void 0) { name = Symbolic.UNIFORM_COLOR; }
            _super.call(this, 'ColorFacet');
            /**
             * @property colorRGB
             * @type Vector3
             * @private
             */
            this.data = new Vector3([1, 1, 1]);
            this.data.modified = true;
            this.name = name;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ColorFacet.prototype.destructor = function () {
            this.data = void 0;
        };
        Object.defineProperty(ColorFacet.prototype, "red", {
            /**
             * The red component of the color.
             * @property red
             * @type {number}
             */
            get: function () {
                return this.data.x;
            },
            set: function (red) {
                this.data.x = red;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "green", {
            /**
             * The green component of the color.
             * @property green
             * @type {number}
             */
            get: function () {
                return this.data.y;
            },
            set: function (green) {
                this.data.y = green;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "blue", {
            /**
             * The green component of the color.
             * @property blue
             * @type {number}
             */
            get: function () {
                return this.data.x;
            },
            set: function (blue) {
                this.data.z = blue;
            },
            enumerable: true,
            configurable: true
        });
        ColorFacet.prototype.scale = function (s) {
            this.red *= s;
            this.green *= s;
            this.blue *= s;
            return this;
        };
        ColorFacet.prototype.setRGB = function (red, green, blue) {
            this.red = red;
            this.green = green;
            this.blue = blue;
            return this;
        };
        ColorFacet.prototype.setUniforms = function (visitor, canvasId) {
            visitor.uniformVector3(this.name, this.data, canvasId);
        };
        return ColorFacet;
    })(Shareable);
    return ColorFacet;
});
