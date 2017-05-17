import * as tslib_1 from "tslib";
import { mustBeDefined } from '../checks/mustBeDefined';
import { notSupported } from '../i18n/notSupported';
import { ShareableContextConsumer } from './ShareableContextConsumer';
/**
 * GeometryBase
 */
var GeometryBase = (function (_super) {
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
        mustBeDefined('material', material);
        throw new Error(notSupported("bind(material: Material)").message);
    };
    /**
     *
     */
    GeometryBase.prototype.unbind = function (material) {
        mustBeDefined('material', material);
        throw new Error(notSupported("unbind(material: Material)").message);
    };
    /**
     *
     */
    GeometryBase.prototype.draw = function () {
        throw new Error(notSupported('draw()').message);
    };
    return GeometryBase;
}(ShareableContextConsumer));
export { GeometryBase };
