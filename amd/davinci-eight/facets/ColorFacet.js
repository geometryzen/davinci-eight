var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/Color', '../core', '../checks/mustBeNumber', '../utils/Shareable', '../core/GraphicsProgramSymbols'], function (require, exports, Color_1, core_1, mustBeNumber_1, Shareable_1, GraphicsProgramSymbols_1) {
    var COORD_R = 0;
    var COORD_G = 1;
    var COORD_B = 2;
    function checkPropertyName(name) {
        if (typeof name !== 'string') {
            var msg = "ColorFacet property 'name' must be a string.";
            if (core_1.default.strict) {
                throw new TypeError(msg);
            }
            else {
                console.warn(msg);
            }
        }
        switch (name) {
            case ColorFacet.PROP_RGB: return;
            default: {
                var msg = "ColorFacet property 'name' must be one of " + [ColorFacet.PROP_RGB, ColorFacet.PROP_RGBA, ColorFacet.PROP_RED, ColorFacet.PROP_GREEN, ColorFacet.PROP_BLUE, ColorFacet.PROP_ALPHA] + ".";
                if (core_1.default.strict) {
                    throw new Error(msg);
                }
                else {
                    console.warn(msg);
                }
            }
        }
    }
    var ColorFacet = (function (_super) {
        __extends(ColorFacet, _super);
        function ColorFacet() {
            _super.call(this, 'ColorFacet');
            this.color = Color_1.default.fromRGB(1, 1, 1);
            this.a = 1;
            this.uColorName = GraphicsProgramSymbols_1.default.UNIFORM_COLOR;
            this.uAlphaName = GraphicsProgramSymbols_1.default.UNIFORM_ALPHA;
        }
        ColorFacet.prototype.destructor = function () {
            this.color = void 0;
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
        Object.defineProperty(ColorFacet.prototype, "r", {
            get: function () {
                return this.color.r;
            },
            set: function (red) {
                mustBeNumber_1.default('red', red);
                this.color.r = red;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "g", {
            get: function () {
                return this.color.g;
            },
            set: function (green) {
                mustBeNumber_1.default('green', green);
                this.color.g = green;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "b", {
            get: function () {
                return this.color.b;
            },
            set: function (blue) {
                mustBeNumber_1.default('blue', blue);
                this.color.b = blue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "α", {
            get: function () {
                return this.a;
            },
            set: function (α) {
                this.a = α;
            },
            enumerable: true,
            configurable: true
        });
        ColorFacet.prototype.scaleRGB = function (α) {
            this.r *= α;
            this.g *= α;
            this.b *= α;
            return this;
        };
        ColorFacet.prototype.scaleRGBA = function (α) {
            this.r *= α;
            this.g *= α;
            this.b *= α;
            this.α *= α;
            return this;
        };
        ColorFacet.prototype.setRGB = function (red, green, blue) {
            this.r = red;
            this.g = green;
            this.b = blue;
            return this;
        };
        ColorFacet.prototype.setRGBA = function (red, green, blue, α) {
            this.r = red;
            this.g = green;
            this.b = blue;
            this.α = α;
            return this;
        };
        ColorFacet.prototype.getProperty = function (name) {
            checkPropertyName(name);
            switch (name) {
                case ColorFacet.PROP_RGB:
                    {
                        return [this.r, this.g, this.b];
                    }
                    break;
                case ColorFacet.PROP_RED:
                    {
                        return [this.r];
                    }
                    break;
                case ColorFacet.PROP_GREEN:
                    {
                        return [this.g];
                    }
                    break;
                default: {
                    return void 0;
                }
            }
        };
        ColorFacet.prototype.setProperty = function (name, data) {
            checkPropertyName(name);
            switch (name) {
                case ColorFacet.PROP_RGB:
                    {
                        this.r = data[COORD_R];
                        this.g = data[COORD_G];
                        this.b = data[COORD_B];
                    }
                    break;
                case ColorFacet.PROP_RED:
                    {
                        this.r = data[COORD_R];
                    }
                    break;
                default: {
                }
            }
            return this;
        };
        ColorFacet.prototype.setUniforms = function (visitor) {
            if (this.uColorName) {
                visitor.vector3(this.uColorName, this.color.coords);
            }
            if (this.uAlphaName) {
                visitor.uniform1f(this.uAlphaName, this.a);
            }
        };
        ColorFacet.PROP_RGB = 'rgb';
        ColorFacet.PROP_RGBA = 'rgba';
        ColorFacet.PROP_RED = 'r';
        ColorFacet.PROP_GREEN = 'g';
        ColorFacet.PROP_BLUE = 'b';
        ColorFacet.PROP_ALPHA = 'a';
        return ColorFacet;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ColorFacet;
});
