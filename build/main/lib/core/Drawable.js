"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var exchange_1 = require("../base/exchange");
var GraphicsProgramSymbols_1 = require("./GraphicsProgramSymbols");
var isObject_1 = require("../checks/isObject");
var isNull_1 = require("../checks/isNull");
var isNumber_1 = require("../checks/isNumber");
var isUndefined_1 = require("../checks/isUndefined");
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var mustBeNonNullObject_1 = require("../checks/mustBeNonNullObject");
var OpacityFacet_1 = require("../facets/OpacityFacet");
var PointSizeFacet_1 = require("../facets/PointSizeFacet");
var ShareableContextConsumer_1 = require("../core/ShareableContextConsumer");
var StringShareableMap_1 = require("../collections/StringShareableMap");
var OPACITY_FACET_NAME = 'opacity';
var POINTSIZE_FACET_NAME = 'pointSize';
var DRAWABLE_LOGGING_NAME = 'Drawable';
/**
 * This class may be used as either a base class or standalone.
 */
var Drawable = /** @class */ (function (_super) {
    tslib_1.__extends(Drawable, _super);
    /**
     *
     */
    function Drawable(geometry, material, contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, mustBeNonNullObject_1.mustBeNonNullObject('contextManager', contextManager)) || this;
        _this._visible = true;
        _this._transparent = false;
        _this.facetMap = new StringShareableMap_1.StringShareableMap();
        _this.setLoggingName(DRAWABLE_LOGGING_NAME);
        if (isObject_1.isObject(geometry)) {
            // The assignment takes care of the addRef.
            _this.geometry = geometry;
        }
        if (isObject_1.isObject(material)) {
            // The assignment takes care of the addRef.
            _this.material = material;
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Drawable.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName(DRAWABLE_LOGGING_NAME);
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    Drawable.prototype.destructor = function (levelUp) {
        this.facetMap.release();
        if (levelUp === 0) {
            this.cleanUp();
        }
        this._geometry = exchange_1.exchange(this._geometry, void 0);
        this._material = exchange_1.exchange(this._material, void 0);
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Drawable.prototype, "opacity", {
        get: function () {
            var facet = this.getFacet(OPACITY_FACET_NAME);
            if (facet) {
                return facet.opacity;
            }
            else {
                return void 0;
            }
        },
        set: function (newOpacity) {
            if (isNumber_1.isNumber(newOpacity)) {
                var facet = this.getFacet(OPACITY_FACET_NAME);
                if (facet) {
                    facet.opacity = newOpacity;
                }
                else {
                    this.setFacet(OPACITY_FACET_NAME, new OpacityFacet_1.OpacityFacet(newOpacity));
                }
            }
            else if (isUndefined_1.isUndefined(newOpacity) || isNull_1.isNull(newOpacity)) {
                this.removeFacet(OPACITY_FACET_NAME);
            }
            else {
                throw new TypeError("opacity must be a number, undefined, or null.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "pointSize", {
        get: function () {
            var facet = this.getFacet(POINTSIZE_FACET_NAME);
            if (facet) {
                return facet.pointSize;
            }
            else {
                return void 0;
            }
        },
        set: function (newPointSize) {
            if (isNumber_1.isNumber(newPointSize)) {
                var facet = this.getFacet(POINTSIZE_FACET_NAME);
                if (facet) {
                    facet.pointSize = newPointSize;
                }
                else {
                    this.setFacet(POINTSIZE_FACET_NAME, new PointSizeFacet_1.PointSizeFacet(newPointSize));
                }
            }
            else if (isUndefined_1.isUndefined(newPointSize) || isNull_1.isNull(newPointSize)) {
                this.removeFacet(POINTSIZE_FACET_NAME);
            }
            else {
                throw new TypeError("pointSize must be a number, undefined, or null.");
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * A convenience method for calling geometry.bind(material).
     */
    Drawable.prototype.bind = function () {
        this._geometry.bind(this._material);
        return this;
    };
    /**
     * Sets the Material uniforms from the Facets of this composite object.
     */
    Drawable.prototype.setUniforms = function () {
        var material = this._material;
        var keys = this.facetMap.keys;
        var keysLength = keys.length;
        for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var facet = this.facetMap.getWeakRef(key);
            facet.setUniforms(material);
        }
        return this;
    };
    /**
     *
     */
    Drawable.prototype.draw = function () {
        if (this._visible) {
            if (this._geometry) {
                this._geometry.draw();
            }
        }
        return this;
    };
    Drawable.prototype.contextFree = function () {
        if (this._geometry && this._geometry.contextFree) {
            this._geometry.contextFree();
        }
        if (this._material && this._material.contextFree) {
            this._material.contextFree();
        }
        if (_super.prototype.contextFree) {
            _super.prototype.contextFree.call(this);
        }
    };
    Drawable.prototype.contextGain = function () {
        if (this._geometry && this._geometry.contextGain) {
            this._geometry.contextGain();
        }
        if (this._material && this._material.contextGain) {
            this._material.contextGain();
        }
        synchFacets(this._material, this);
        if (_super.prototype.contextGain) {
            _super.prototype.contextGain.call(this);
        }
    };
    Drawable.prototype.contextLost = function () {
        if (this._geometry && this._geometry.contextLost) {
            this._geometry.contextLost();
        }
        if (this._material && this._material.contextLost) {
            this._material.contextLost();
        }
        if (_super.prototype.contextLost) {
            _super.prototype.contextLost.call(this);
        }
    };
    /**
     * @param name The name of the Facet.
     */
    Drawable.prototype.getFacet = function (name) {
        return this.facetMap.get(name);
    };
    /**
     * A convenience method for performing all of the methods required for rendering.
     * The following methods are called in order.
     * use()
     * bind()
     * setAmbients(ambients)
     * setUniforms()
     * draw()
     * unbind()
     * In particle simulations it may be useful to call the underlying methods directly.
     */
    Drawable.prototype.render = function (ambients) {
        if (this._visible) {
            this.use().bind().setAmbients(ambients).setUniforms().draw().unbind();
        }
        return this;
    };
    /**
     * Updates the Material uniforms from the ambient Facets argument.
     */
    Drawable.prototype.setAmbients = function (ambients) {
        var iL = ambients.length;
        for (var i = 0; i < iL; i++) {
            var facet = ambients[i];
            facet.setUniforms(this._material);
        }
        return this;
    };
    Drawable.prototype.removeFacet = function (name) {
        return this.facetMap.remove(name);
    };
    /**
     * @param name The name of the Facet.
     * @param facet The Facet.
     */
    Drawable.prototype.setFacet = function (name, facet) {
        this.facetMap.put(name, facet);
    };
    Drawable.prototype.unbind = function () {
        this._geometry.unbind(this._material);
        return this;
    };
    Drawable.prototype.use = function () {
        this._material.use();
        return this;
    };
    Object.defineProperty(Drawable.prototype, "geometry", {
        /**
         * Provides a reference counted reference to the geometry property.
         */
        get: function () {
            return exchange_1.exchange(void 0, this._geometry);
        },
        set: function (geometry) {
            this._geometry = exchange_1.exchange(this._geometry, geometry);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "material", {
        /**
         * Provides a reference counted reference to the material property.
         */
        get: function () {
            return exchange_1.exchange(void 0, this._material);
        },
        set: function (material) {
            this._material = exchange_1.exchange(this._material, material);
            synchFacets(this._material, this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "visible", {
        /**
         * @default true
         */
        get: function () {
            return this._visible;
        },
        set: function (visible) {
            var _this = this;
            mustBeBoolean_1.mustBeBoolean('visible', visible, function () { return _this.getLoggingName(); });
            this._visible = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "transparent", {
        /**
         * @default false
         */
        get: function () {
            return this._transparent;
        },
        set: function (transparent) {
            var _this = this;
            mustBeBoolean_1.mustBeBoolean('transparent', transparent, function () { return _this.getLoggingName(); });
            this._transparent = transparent;
        },
        enumerable: true,
        configurable: true
    });
    return Drawable;
}(ShareableContextConsumer_1.ShareableContextConsumer));
exports.Drawable = Drawable;
/**
 * Helper function to synchronize and optimize facets.
 */
function synchFacets(material, drawable) {
    if (material) {
        // Ensure that the opacity property is initialized if the material has a corresponding uniform.
        if (material.hasUniform(GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY)) {
            if (!isNumber_1.isNumber(drawable.opacity)) {
                drawable.opacity = 1.0;
            }
        }
        else {
            drawable.removeFacet(OPACITY_FACET_NAME);
        }
        // Ensure that the pointSize property is initialized if the material has a corresponding uniform.
        if (material.hasUniform(GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_POINT_SIZE)) {
            if (!isNumber_1.isNumber(drawable.pointSize)) {
                drawable.pointSize = 2;
            }
        }
        else {
            drawable.removeFacet(POINTSIZE_FACET_NAME);
        }
    }
}
