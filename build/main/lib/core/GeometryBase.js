"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryBase = void 0;
var tslib_1 = require("tslib");
var mustBeDefined_1 = require("../checks/mustBeDefined");
var notSupported_1 = require("../i18n/notSupported");
var ShareableContextConsumer_1 = require("./ShareableContextConsumer");
/**
 * GeometryBase
 */
var GeometryBase = /** @class */ (function (_super) {
    tslib_1.__extends(GeometryBase, _super);
    /**
     *
     */
    function GeometryBase(contextManager, levelUp) {
        var _this = _super.call(this, contextManager) || this;
        _this.setLoggingName("GeometryBase");
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GeometryBase.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName("GeometryBase");
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    GeometryBase.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    GeometryBase.prototype.bind = function (material) {
        mustBeDefined_1.mustBeDefined('material', material);
        throw new Error(notSupported_1.notSupported("bind(material: Material)").message);
    };
    /**
     *
     */
    GeometryBase.prototype.unbind = function (material) {
        mustBeDefined_1.mustBeDefined('material', material);
        throw new Error(notSupported_1.notSupported("unbind(material: Material)").message);
    };
    /**
     *
     */
    GeometryBase.prototype.draw = function () {
        throw new Error(notSupported_1.notSupported('draw()').message);
    };
    return GeometryBase;
}(ShareableContextConsumer_1.ShareableContextConsumer));
exports.GeometryBase = GeometryBase;
