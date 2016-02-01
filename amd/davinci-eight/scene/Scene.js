var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../scene/createDrawList', '../scene/MonitorList', '../checks/mustBeArray', '../checks/mustBeFunction', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, createDrawList_1, MonitorList_1, mustBeArray_1, mustBeFunction_1, mustBeNumber_1, mustBeObject_1, mustBeString_1, Shareable_1) {
    var LOGGING_NAME = 'Scene';
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, LOGGING_NAME);
            mustBeArray_1.default('monitors', monitors);
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
            mustBeObject_1.default('drawable', drawable);
            return this.drawList.add(drawable);
        };
        Scene.prototype.containsDrawable = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            return this.drawList.containsDrawable(drawable);
        };
        Scene.prototype.draw = function (ambients, canvasId) {
            mustBeArray_1.default('ambients', ambients);
            mustBeNumber_1.default('canvasId', canvasId);
            return this.drawList.draw(ambients, canvasId);
        };
        Scene.prototype.findOne = function (match) {
            mustBeFunction_1.default('match', match);
            return this.drawList.findOne(match);
        };
        Scene.prototype.getDrawableByName = function (name) {
            mustBeString_1.default('name', name);
            return this.drawList.getDrawableByName(name);
        };
        Scene.prototype.getDrawablesByName = function (name) {
            mustBeString_1.default('name', name);
            return this.drawList.getDrawablesByName(name);
        };
        Scene.prototype.remove = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            return this.drawList.remove(drawable);
        };
        Scene.prototype.traverse = function (callback, canvasId, prolog) {
            mustBeFunction_1.default('callback', callback);
            mustBeNumber_1.default('canvasId', canvasId);
            this.drawList.traverse(callback, canvasId, prolog);
        };
        Scene.prototype.contextFree = function (canvasId) {
            mustBeNumber_1.default('canvasId', canvasId);
            this.drawList.contextFree(canvasId);
        };
        Scene.prototype.contextGain = function (manager) {
            mustBeObject_1.default('manager', manager);
            this.drawList.contextGain(manager);
        };
        Scene.prototype.contextLost = function (canvasId) {
            mustBeNumber_1.default('canvasId', canvasId);
            this.drawList.contextLost(canvasId);
        };
        return Scene;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scene;
});
