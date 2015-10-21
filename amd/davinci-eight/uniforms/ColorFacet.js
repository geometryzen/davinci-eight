var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../utils/Shareable', '../core/Symbolic', '../math/MutableVectorE3'], function (require, exports, Shareable, Symbolic, MutableVectorE3) {
    /**
     * @class ColorFacet
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
             * @type MutableVectorE3
             * @private
             */
            this.data = new MutableVectorE3([1, 1, 1]);
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
            _super.prototype.destructor.call(this);
        };
        ColorFacet.prototype.incRef = function () {
            this.addRef();
            return this;
        };
        ColorFacet.prototype.decRef = function () {
            this.release();
            return this;
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
                return this.data.z;
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
        ColorFacet.prototype.setColor = function (color) {
            this.red = color.red;
            this.green = color.green;
            this.blue = color.blue;
            return this;
        };
        ColorFacet.prototype.setRGB = function (red, green, blue) {
            this.red = red;
            this.green = green;
            this.blue = blue;
            return this;
        };
        ColorFacet.prototype.getProperty = function (name) {
            switch (name) {
                case ColorFacet.PROP_RGB: {
                    return [this.red, this.green, this.blue];
                }
                case ColorFacet.PROP_RED: {
                    return [this.red];
                }
                default: {
                    console.warn("ColorFacet.getProperty " + name);
                    return void 0;
                }
            }
        };
        ColorFacet.prototype.setProperty = function (name, data) {
            switch (name) {
                case ColorFacet.PROP_RGB:
                    {
                        this.red = data[0];
                        this.green = data[1];
                        this.blue = data[2];
                    }
                    break;
                case ColorFacet.PROP_RED:
                    {
                        this.red = data[0];
                    }
                    break;
                default: {
                    console.warn("ColorFacet.setProperty " + name);
                }
            }
        };
        ColorFacet.prototype.setUniforms = function (visitor, canvasId) {
            visitor.uniformVectorE3(this.name, this.data, canvasId);
        };
        /**
         * property PROP_RGB
         * @type {string}
         * @static
         */
        ColorFacet.PROP_RGB = 'rgb';
        /**
         * property PROP_RED
         * @type {string}
         * @static
         */
        ColorFacet.PROP_RED = 'red';
        return ColorFacet;
    })(Shareable);
    return ColorFacet;
});
