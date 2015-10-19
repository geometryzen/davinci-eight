var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/isDefined', '../collections/IUnknownArray', '../collections/NumberIUnknownMap', '../utils/Shareable', '../collections/StringIUnknownMap'], function (require, exports, isDefined, IUnknownArray, NumberIUnknownMap, Shareable, StringIUnknownMap) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'Drawable';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class Drawable
     * @extends Shareable
     * @extends IDrawable
     */
    var Drawable = (function (_super) {
        __extends(Drawable, _super);
        // FIXME: Do we insist on a IContextMonitor here.
        // We can also assume that we are OK because of the Scene - but can't assume that there is one?
        /**
         * @class Drawable
         * @constructor
         * @param primitives {DrawPrimitive[]}
         * @param material {M}
         * @param model {U}
         */
        function Drawable(primitives, material) {
            _super.call(this, LOGGING_NAME);
            this.primitives = primitives;
            this._material = material;
            this._material.addRef();
            this.buffersByCanvasId = new NumberIUnknownMap();
            this.uniforms = new StringIUnknownMap(LOGGING_NAME);
        }
        Drawable.prototype.destructor = function () {
            this.primitives = void 0;
            this.buffersByCanvasId.release();
            this.buffersByCanvasId = void 0;
            this._material.release();
            this._material = void 0;
            this.uniforms.release();
            this.uniforms = void 0;
        };
        Drawable.prototype.draw = function (canvasId) {
            // We know we are going to need a "good" canvasId to perform the buffers lookup.
            // So we may as well test that condition now.
            if (isDefined(canvasId)) {
                var material = this._material;
                var buffers = this.buffersByCanvasId.getWeakRef(canvasId);
                if (isDefined(buffers)) {
                    material.use(canvasId);
                    // FIXME: The name is unused. Think we should just have a list
                    // and then access using either the real uniform name or a property name.
                    this.uniforms.forEach(function (name, uniform) {
                        uniform.setUniforms(material, canvasId);
                    });
                    for (var i = 0; i < buffers.length; i++) {
                        var buffer = buffers.getWeakRef(i);
                        buffer.bind(material /*, aNameToKeyName*/); // FIXME: Why not part of the API?
                        buffer.draw();
                        buffer.unbind();
                    }
                }
            }
        };
        Drawable.prototype.contextFree = function (canvasId) {
            this._material.contextFree(canvasId);
        };
        Drawable.prototype.contextGain = function (manager) {
            // 1. Replace the existing buffer geometry if we have geometry. 
            if (this.primitives) {
                for (var i = 0; i < this.primitives.length; i++) {
                    var primitive = this.primitives[i];
                    if (!this.buffersByCanvasId.exists(manager.canvasId)) {
                        this.buffersByCanvasId.putWeakRef(manager.canvasId, new IUnknownArray([], 'Drawable.buffers'));
                    }
                    var buffers = this.buffersByCanvasId.getWeakRef(manager.canvasId);
                    buffers.pushWeakRef(manager.createBufferGeometry(primitive));
                }
            }
            else {
                console.warn(LOGGING_NAME + " contextGain method has no elements, canvasId => " + manager.canvasId);
            }
            // 2. Delegate the context to the material.
            this._material.contextGain(manager);
        };
        Drawable.prototype.contextLost = function (canvasId) {
            this._material.contextLost(canvasId);
        };
        /**
         * @method getFacet
         * @param name {string}
         * @return {IFacet}
         */
        Drawable.prototype.getFacet = function (name) {
            return this.uniforms.get(name);
        };
        Drawable.prototype.setFacet = function (name, value) {
            this.uniforms.put(name, value);
            return value;
        };
        Object.defineProperty(Drawable.prototype, "material", {
            /**
             * @property material
             * @type {M}
             *
             * Provides a reference counted reference to the material.
             */
            get: function () {
                this._material.addRef();
                return this._material;
            },
            enumerable: true,
            configurable: true
        });
        return Drawable;
    })(Shareable);
    return Drawable;
});
