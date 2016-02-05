var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../collections/IUnknownArray', '../checks/mustBeFunction', '../checks/mustBeObject', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, core_1, IUnknownArray_1, mustBeFunction_1, mustBeObject_1, mustBeString_1, Shareable_1) {
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this, 'Scene');
            this._drawables = new IUnknownArray_1.default();
        }
        Scene.prototype.destructor = function () {
            if (this._monitor) {
                console.warn(this._type + ".destructor but still using monitor!");
            }
            this._drawables.release();
            _super.prototype.destructor.call(this);
        };
        Scene.prototype.attachTo = function (monitor) {
            monitor.addRef();
            monitor.addContextListener(this);
            this._monitor = monitor;
        };
        Scene.prototype.detachFrom = function (unused) {
            if (this._monitor) {
                this._monitor.removeContextListener(this);
                this._monitor.release();
                this._monitor = void 0;
            }
        };
        Scene.prototype.add = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            this._drawables.push(drawable);
        };
        Scene.prototype.containsDrawable = function (drawable) {
            mustBeObject_1.default('drawable', drawable);
            return this._drawables.indexOf(drawable) >= 0;
        };
        Scene.prototype.draw = function (ambients) {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                var graphicsProgram = drawable.graphicsProgram;
                graphicsProgram.use();
                if (ambients) {
                    var aLength = ambients.length;
                    for (var a = 0; a < aLength; a++) {
                        var ambient = ambients[a];
                        ambient.setUniforms(graphicsProgram);
                    }
                }
                drawable.setUniforms();
                var buffers = drawable.graphicsBuffers;
                buffers.draw(graphicsProgram);
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
        Scene.prototype.contextFree = function (manager) {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                drawable.contextFree(manager);
            }
        };
        Scene.prototype.contextGain = function (manager) {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                drawable.contextGain(manager);
            }
        };
        Scene.prototype.contextLost = function () {
            for (var i = 0; i < this._drawables.length; i++) {
                var drawable = this._drawables.getWeakRef(i);
                drawable.contextLost();
            }
        };
        return Scene;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scene;
});
