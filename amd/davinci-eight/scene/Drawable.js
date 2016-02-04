var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../i18n/readOnly', '../utils/Shareable', '../collections/StringIUnknownMap'], function (require, exports, readOnly_1, Shareable_1, StringIUnknownMap_1) {
    var Drawable = (function (_super) {
        __extends(Drawable, _super);
        function Drawable(graphicsBuffers, graphicsProgram) {
            _super.call(this, 'Drawable');
            this._graphicsBuffers = graphicsBuffers;
            this._graphicsBuffers.addRef();
            this._graphicsProgram = graphicsProgram;
            this._graphicsProgram.addRef();
            this._facets = new StringIUnknownMap_1.default();
        }
        Drawable.prototype.destructor = function () {
            this._graphicsBuffers.release();
            this._graphicsBuffers = void 0;
            this._graphicsProgram.release();
            this._graphicsProgram = void 0;
            this._facets.release();
            this._facets = void 0;
            _super.prototype.destructor.call(this);
        };
        Drawable.prototype.draw = function (canvasId) {
            var program = this._graphicsProgram;
            program.use(canvasId);
            this.setUniforms(canvasId);
            this._graphicsBuffers.draw(program, canvasId);
        };
        Drawable.prototype.setUniforms = function (canvasId) {
            var _this = this;
            var facets = this._facets;
            facets.forEach(function (name, facet) {
                facet.setUniforms(_this._graphicsProgram, canvasId);
            });
        };
        Drawable.prototype.contextFree = function (canvasId) {
            this._graphicsBuffers.contextFree(canvasId);
            this._graphicsProgram.contextFree(canvasId);
        };
        Drawable.prototype.contextGain = function (manager) {
            this._graphicsBuffers.contextGain(manager);
            this._graphicsProgram.contextGain(manager);
        };
        Drawable.prototype.contextLost = function (canvasId) {
            this._graphicsBuffers.contextLost(canvasId);
            this._graphicsProgram.contextLost(canvasId);
        };
        Drawable.prototype.getFacet = function (name) {
            return this._facets.get(name);
        };
        Drawable.prototype.setFacet = function (name, facet) {
            this._facets.put(name, facet);
        };
        Object.defineProperty(Drawable.prototype, "graphicsBuffers", {
            get: function () {
                this._graphicsBuffers.addRef();
                return this._graphicsBuffers;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('graphicsBuffers').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Drawable.prototype, "graphicsProgram", {
            get: function () {
                this._graphicsProgram.addRef();
                return this._graphicsProgram;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('graphicsProgram').message);
            },
            enumerable: true,
            configurable: true
        });
        return Drawable;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Drawable;
});
