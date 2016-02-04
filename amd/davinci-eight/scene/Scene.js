var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../collections/IUnknownArray', '../scene/MonitorList', '../checks/mustBeArray', '../checks/mustBeFunction', '../checks/mustBeNumber', '../checks/mustBeObject', '../checks/mustBeString', '../collections/NumberIUnknownMap', '../utils/Shareable'], function (require, exports, core_1, IUnknownArray_1, MonitorList_1, mustBeArray_1, mustBeFunction_1, mustBeNumber_1, mustBeObject_1, mustBeString_1, NumberIUnknownMap_1, Shareable_1) {
    var LOGGING_NAME = 'Scene';
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, LOGGING_NAME);
            this._canvasIdToManager = new NumberIUnknownMap_1.default();
            mustBeArray_1.default('monitors', monitors);
            MonitorList_1.default.verify('monitors', monitors, ctorContext);
            this.monitors = new MonitorList_1.default(monitors);
            this.monitors.addContextListener(this);
            this.monitors.synchronize(this);
            this._drawables = new IUnknownArray_1.default();
        }
        Scene.prototype.destructor = function () {
            this.monitors.removeContextListener(this);
            this.monitors.release();
            this._canvasIdToManager.release();
            this._drawables.release();
            _super.prototype.destructor.call(this);
        };
        Scene.prototype.attachTo = function (monitor) {
            this.monitors.add(monitor);
            monitor.addContextListener(this);
        };
        Scene.prototype.detachFrom = function (monitor) {
            monitor.removeContextListener(this);
            this.monitors.remove(monitor);
        };
        Scene.prototype.add = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            this._canvasIdToManager.forEach(function (id, manager) {
                drawable.contextGain(manager);
            });
            this._drawables.push(drawable);
        };
        Scene.prototype.containsDrawable = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            return this._drawables.indexOf(drawable) >= 0;
        };
        Scene.prototype.draw = function (ambients, canvasId) {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                var graphicsProgram = drawable.graphicsProgram;
                graphicsProgram.use(canvasId);
                if (ambients) {
                    var aLength = ambients.length;
                    for (var a = 0; a < aLength; a++) {
                        var ambient = ambients[a];
                        ambient.setUniforms(graphicsProgram, canvasId);
                    }
                }
                drawable.setUniforms(canvasId);
                var buffers = drawable.graphicsBuffers;
                buffers.draw(graphicsProgram, canvasId);
                buffers.release();
                graphicsProgram.release();
            }
        };
        Scene.prototype.findOne = function (match) {
            mustBeFunction_1.default('match', match);
            var drawables = this._drawables;
            for (var i = 0, iLength = drawables.length; i < iLength; i++) {
                var candidate = drawables.get(i);
                if (match(candidate)) {
                    return candidate;
                }
                else {
                    candidate.release();
                }
            }
            return void 0;
        };
        Scene.prototype.getDrawableByName = function (name) {
            if (!core_1.default.fastPath) {
                mustBeString_1.default('name', name);
            }
            return this.findOne(function (drawable) { return drawable.name === name; });
        };
        Scene.prototype.getDrawablesByName = function (name) {
            mustBeString_1.default('name', name);
            var result = new IUnknownArray_1.default();
            return result;
        };
        Scene.prototype.remove = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            throw new Error("TODO");
        };
        Scene.prototype.contextFree = function (canvasId) {
            mustBeNumber_1.default('canvasId', canvasId);
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                drawable.contextFree(canvasId);
            }
            this._canvasIdToManager.remove(canvasId);
        };
        Scene.prototype.contextGain = function (manager) {
            mustBeObject_1.default('manager', manager);
            if (!this._canvasIdToManager.exists(manager.canvasId)) {
                this._canvasIdToManager.put(manager.canvasId, manager);
            }
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                drawable.contextGain(manager);
            }
        };
        Scene.prototype.contextLost = function (canvasId) {
            mustBeNumber_1.default('canvasId', canvasId);
            if (this._canvasIdToManager.exists(canvasId)) {
                this._canvasIdToManager.remove(canvasId);
            }
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                drawable.contextLost(canvasId);
            }
        };
        return Scene;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scene;
});
