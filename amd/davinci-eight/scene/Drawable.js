var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/isDefined', '../collections/IUnknownArray', '../collections/NumberIUnknownMap', '../i18n/readOnly', '../utils/Shareable', '../collections/StringIUnknownMap'], function (require, exports, isDefined_1, IUnknownArray_1, NumberIUnknownMap_1, readOnly_1, Shareable_1, StringIUnknownMap_1) {
    var LOGGING_NAME = 'Drawable';
    var Drawable = (function (_super) {
        __extends(Drawable, _super);
        function Drawable(primitives, material) {
            _super.call(this, LOGGING_NAME);
            this.primitives = primitives;
            this.graphicsProgram = material;
            this.graphicsProgram.addRef();
            this.buffersByCanvasId = new NumberIUnknownMap_1.default();
            this.facets = new StringIUnknownMap_1.default();
        }
        Drawable.prototype.destructor = function () {
            this.primitives = void 0;
            this.buffersByCanvasId.release();
            this.buffersByCanvasId = void 0;
            this.graphicsProgram.release();
            this.graphicsProgram = void 0;
            this.facets.release();
            this.facets = void 0;
        };
        Drawable.prototype.draw = function (canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (isDefined_1.default(canvasId)) {
                var material = this.graphicsProgram;
                var buffers = this.buffersByCanvasId.getWeakRef(canvasId);
                if (isDefined_1.default(buffers)) {
                    material.use(canvasId);
                    this.facets.forEach(function (name, uniform) {
                        uniform.setUniforms(material, canvasId);
                    });
                    for (var i = 0; i < buffers.length; i++) {
                        var buffer = buffers.getWeakRef(i);
                        buffer.bind(material);
                        buffer.draw();
                        buffer.unbind();
                    }
                }
            }
        };
        Drawable.prototype.contextFree = function (canvasId) {
            this.graphicsProgram.contextFree(canvasId);
        };
        Drawable.prototype.contextGain = function (manager) {
            if (this.primitives) {
                for (var i = 0, iLength = this.primitives.length; i < iLength; i++) {
                    var primitive = this.primitives[i];
                    if (!this.buffersByCanvasId.exists(manager.canvasId)) {
                        this.buffersByCanvasId.putWeakRef(manager.canvasId, new IUnknownArray_1.default([]));
                    }
                    var buffers = this.buffersByCanvasId.getWeakRef(manager.canvasId);
                    buffers.pushWeakRef(manager.createBufferGeometry(primitive));
                }
            }
            else {
                console.warn("contextGain method has no primitices, canvasId => " + manager.canvasId);
            }
            this.graphicsProgram.contextGain(manager);
        };
        Drawable.prototype.contextLost = function (canvasId) {
            this.graphicsProgram.contextLost(canvasId);
        };
        Drawable.prototype.getFacet = function (name) {
            return this.facets.get(name);
        };
        Drawable.prototype.setFacet = function (name, facet) {
            this.facets.put(name, facet);
        };
        Object.defineProperty(Drawable.prototype, "material", {
            get: function () {
                this.graphicsProgram.addRef();
                return this.graphicsProgram;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('material').message);
            },
            enumerable: true,
            configurable: true
        });
        return Drawable;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Drawable;
});
