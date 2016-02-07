var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../collections/IUnknownArray', '../checks/mustBeFunction', '../checks/mustBeObject', '../checks/mustBeString', '../core/Shareable', '../core/ShareableContextListener'], function (require, exports, core_1, IUnknownArray_1, mustBeFunction_1, mustBeObject_1, mustBeString_1, Shareable_1, ShareableContextListener_1) {
    var ScenePart = (function (_super) {
        __extends(ScenePart, _super);
        function ScenePart(buffer, composite) {
            _super.call(this, 'ScenePart');
            this._buffer = buffer;
            this._buffer.addRef();
            this._composite = composite;
            this._composite.addRef();
        }
        ScenePart.prototype.destructor = function () {
            this._buffer.release();
            this._composite.release();
            this._buffer = void 0;
            this._composite = void 0;
            _super.prototype.destructor.call(this);
        };
        ScenePart.prototype.draw = function (ambients) {
            var program = this._composite.program;
            program.use();
            if (ambients) {
                var aLength = ambients.length;
                for (var a = 0; a < aLength; a++) {
                    var ambient = ambients[a];
                    ambient.setUniforms(program);
                }
            }
            this._composite.setUniforms();
            this._buffer.draw(program);
            program.release();
        };
        return ScenePart;
    })(Shareable_1.default);
    function partsFromComposite(composite) {
        mustBeObject_1.default('composite', composite);
        var parts = new IUnknownArray_1.default();
        var buffers = composite.buffers;
        var iLen = buffers.length;
        for (var i = 0; i < iLen; i++) {
            var scenePart = new ScenePart(buffers.getWeakRef(i), composite);
            parts.pushWeakRef(scenePart);
        }
        buffers.release();
        return parts;
    }
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this, 'Scene');
            this._composites = new IUnknownArray_1.default();
            this._parts = new IUnknownArray_1.default();
        }
        Scene.prototype.destructor = function () {
            this.detachFromMonitor();
            this._composites.release();
            this._parts.release();
            _super.prototype.destructor.call(this);
        };
        Scene.prototype.add = function (composite) {
            mustBeObject_1.default('composite', composite);
            this._composites.push(composite);
            var drawParts = partsFromComposite(composite);
            var iLen = drawParts.length;
            for (var i = 0; i < iLen; i++) {
                var part = drawParts.get(i);
                this._parts.push(part);
                part.release();
            }
            drawParts.release();
        };
        Scene.prototype.containsDrawable = function (composite) {
            mustBeObject_1.default('composite', composite);
            return this._composites.indexOf(composite) >= 0;
        };
        Scene.prototype.draw = function (ambients) {
            var parts = this._parts;
            var iLen = parts.length;
            for (var i = 0; i < iLen; i++) {
                parts.getWeakRef(i).draw(ambients);
            }
        };
        Scene.prototype.findOne = function (match) {
            mustBeFunction_1.default('match', match);
            return this._composites.findOne(match);
        };
        Scene.prototype.getDrawableByName = function (name) {
            if (!core_1.default.fastPath) {
                mustBeString_1.default('name', name);
            }
            return this.findOne(function (composite) { return composite.name === name; });
        };
        Scene.prototype.getDrawablesByName = function (name) {
            mustBeString_1.default('name', name);
            var result = new IUnknownArray_1.default();
            return result;
        };
        Scene.prototype.remove = function (composite) {
            mustBeObject_1.default('composite', composite);
            throw new Error("TODO");
        };
        Scene.prototype.contextFree = function (context) {
            for (var i = 0; i < this._composites.length; i++) {
                var composite = this._composites.getWeakRef(i);
                composite.contextFree(context);
            }
            _super.prototype.contextFree.call(this, context);
        };
        Scene.prototype.contextGain = function (context) {
            for (var i = 0; i < this._composites.length; i++) {
                var composite = this._composites.getWeakRef(i);
                composite.contextGain(context);
            }
            _super.prototype.contextGain.call(this, context);
        };
        Scene.prototype.contextLost = function () {
            for (var i = 0; i < this._composites.length; i++) {
                var composite = this._composites.getWeakRef(i);
                composite.contextLost();
            }
            _super.prototype.contextLost.call(this);
        };
        return Scene;
    })(ShareableContextListener_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scene;
});
