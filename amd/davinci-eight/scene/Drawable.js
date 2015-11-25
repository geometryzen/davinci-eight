var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/isDefined', '../collections/IUnknownArray', '../collections/NumberIUnknownMap', '../i18n/readOnly', '../utils/Shareable', '../collections/StringIUnknownMap'], function (require, exports, isDefined, IUnknownArray, NumberIUnknownMap, readOnly, Shareable, StringIUnknownMap) {
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
     */
    var Drawable = (function (_super) {
        __extends(Drawable, _super);
        /**
         * @class Drawable
         * @constructor
         * @param primitives {DrawPrimitive[]}
         * @param material {IGraphicsProgram}
         */
        function Drawable(primitives, material) {
            _super.call(this, LOGGING_NAME);
            this.primitives = primitives;
            this.graphicsProgram = material;
            this.graphicsProgram.addRef();
            this.buffersByCanvasId = new NumberIUnknownMap();
            this.facets = new StringIUnknownMap();
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        Drawable.prototype.destructor = function () {
            this.primitives = void 0;
            this.buffersByCanvasId.release();
            this.buffersByCanvasId = void 0;
            this.graphicsProgram.release();
            this.graphicsProgram = void 0;
            this.facets.release();
            this.facets = void 0;
        };
        /**
         * @method draw
         * @param [canvasId = 0] {number}
         * @return {void}
         */
        Drawable.prototype.draw = function (canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            // We know we are going to need a "good" canvasId to perform the buffers lookup.
            // So we may as well test that condition now.
            if (isDefined(canvasId)) {
                var material = this.graphicsProgram;
                var buffers = this.buffersByCanvasId.getWeakRef(canvasId);
                if (isDefined(buffers)) {
                    material.use(canvasId);
                    // FIXME: The name is unused. Think we should just have a list
                    // and then access using either the real uniform name or a property name.
                    this.facets.forEach(function (name, uniform) {
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
        /**
         * @method contextFree
         * @param [canvasId] {number}
         */
        Drawable.prototype.contextFree = function (canvasId) {
            this.graphicsProgram.contextFree(canvasId);
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        Drawable.prototype.contextGain = function (manager) {
            // 1. Replace the existing buffer geometry if we have geometry. 
            if (this.primitives) {
                for (var i = 0, iLength = this.primitives.length; i < iLength; i++) {
                    var primitive = this.primitives[i];
                    if (!this.buffersByCanvasId.exists(manager.canvasId)) {
                        this.buffersByCanvasId.putWeakRef(manager.canvasId, new IUnknownArray([]));
                    }
                    var buffers = this.buffersByCanvasId.getWeakRef(manager.canvasId);
                    buffers.pushWeakRef(manager.createBufferGeometry(primitive));
                }
            }
            else {
                console.warn("contextGain method has no primitices, canvasId => " + manager.canvasId);
            }
            // 2. Delegate the context to the material.
            this.graphicsProgram.contextGain(manager);
        };
        /**
         * @method contextLost
         * @param [canvasId] {number}
         * @return {void}
         */
        Drawable.prototype.contextLost = function (canvasId) {
            this.graphicsProgram.contextLost(canvasId);
        };
        /**
         * @method getFacet
         * @param name {string}
         * @return {IFacet}
         */
        Drawable.prototype.getFacet = function (name) {
            return this.facets.get(name);
        };
        /**
         * @method setFacet
         * @param name {string}
         * @param facet {IFacet}
         * @return {void}
         */
        Drawable.prototype.setFacet = function (name, facet) {
            this.facets.put(name, facet);
        };
        Object.defineProperty(Drawable.prototype, "material", {
            /**
             * Provides a reference counted reference to the graphics program.
             * @property material
             * @type {IGraphicsProgram}
             * @readOnly
             */
            get: function () {
                this.graphicsProgram.addRef();
                return this.graphicsProgram;
            },
            set: function (unused) {
                throw new Error(readOnly('material').message);
            },
            enumerable: true,
            configurable: true
        });
        return Drawable;
    })(Shareable);
    return Drawable;
});
