var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../scene/createDrawList', '../scene/MonitorList', '../utils/Shareable'], function (require, exports, core_1, createDrawList_1, MonitorList_1, Shareable_1) {
    var LOGGING_NAME = 'Scene';
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, LOGGING_NAME);
            MonitorList_1.default.verify('monitors', monitors, ctorContext);
            this.drawList = createDrawList_1.default();
            this.monitors = new MonitorList_1.default(monitors);
            this.monitors.addContextListener(this);
            this.monitors.synchronize(this);
        }
        Scene.prototype.destructor = function () {
            this.monitors.removeContextListener(this);
            this.monitors.release();
            this.monitors = void 0;
            this.drawList.release();
            this.drawList = void 0;
        };
        Scene.prototype.add = function (drawable) {
            return this.drawList.add(drawable);
        };
        Scene.prototype.containsDrawable = function (drawable) {
            return this.drawList.containsDrawable(drawable);
        };
        Scene.prototype.draw = function (ambients, canvasId) {
            return this.drawList.draw(ambients, canvasId);
        };
        Scene.prototype.getDrawablesByName = function (name) {
            return this.drawList.getDrawablesByName(name);
        };
        Scene.prototype.remove = function (drawable) {
            return this.drawList.remove(drawable);
        };
        Scene.prototype.traverse = function (callback, canvasId, prolog) {
            this.drawList.traverse(callback, canvasId, prolog);
        };
        Scene.prototype.contextFree = function (canvasId) {
            if (core_1.default.verbose) {
                console.log(this._type + " contextFree(canvasId=" + canvasId + ")");
            }
            this.drawList.contextFree(canvasId);
        };
        Scene.prototype.contextGain = function (manager) {
            if (core_1.default.verbose) {
                console.log(this._type + " contextGain(canvasId=" + manager.canvasId + ")");
            }
            this.drawList.contextGain(manager);
        };
        Scene.prototype.contextLost = function (canvasId) {
            if (core_1.default.verbose) {
                console.log(this._type + " contextLost(canvasId=" + canvasId + ")");
            }
            this.drawList.contextLost(canvasId);
        };
        return Scene;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scene;
});
