var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/isDefined', '../checks/mustBeDefined', '../utils/NumberIUnknownMap', '../utils/Shareable', '../utils/StringIUnknownMap'], function (require, exports, isDefined, mustBeDefined, NumberIUnknownMap, Shareable, StringIUnknownMap) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'Drawable';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class Drawable
     * @implements IDrawable
     */
    var Drawable = (function (_super) {
        __extends(Drawable, _super);
        // FIXME: Do we insist on a IContextMonitor here.
        // We can also assume that we are OK because of the Scene - but can't assume that there is one?
        /**
         * @class Drawable
         * @constructor
         * @param geometry {G}
         * @param material {M}
         * @param model {U}
         */
        function Drawable(geometry, material) {
            _super.call(this, LOGGING_NAME);
            this.geometry = geometry;
            this._material = material;
            this._material.addRef();
            this.buffersByCanvasid = new NumberIUnknownMap();
            this.uniforms = new StringIUnknownMap(LOGGING_NAME);
        }
        Drawable.prototype.destructor = function () {
            this.geometry = void 0;
            this.buffersByCanvasid.release();
            this.buffersByCanvasid = void 0;
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
                var buffers = this.buffersByCanvasid.get(canvasId);
                if (isDefined(buffers)) {
                    material.use(canvasId);
                    // FIXME: The name is unused. Think we should just have a list
                    // and then access using either the real uniform name or a property name.
                    this.uniforms.forEach(function (name, uniform) {
                        uniform.setUniforms(material, canvasId);
                    });
                    buffers.bind(material /*, aNameToKeyName*/); // FIXME: Why not part of the API?
                    buffers.draw();
                    buffers.unbind();
                    buffers.release();
                }
            }
        };
        Drawable.prototype.contextFree = function (canvasId) {
            this._material.contextFree(canvasId);
        };
        Drawable.prototype.contextGain = function (manager) {
            // 1. Replace the existing buffer geometry if we have geometry. 
            if (this.geometry) {
                var data = this.geometry.data;
                var meta = this.geometry.meta;
                mustBeDefined('geometry.data', data, contextBuilder);
                mustBeDefined('geometry.meta', meta, contextBuilder);
                // FIXME: Why is the meta not being used?
                this.buffersByCanvasid.putWeakReference(manager.canvasId, manager.createBufferGeometry(data));
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
