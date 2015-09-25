var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/isDefined', '../checks/mustBeDefined', '../utils/NumberIUnknownMap', '../utils/Shareable'], function (require, exports, isDefined, mustBeDefined, NumberIUnknownMap, Shareable) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'Mesh';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class Mesh
     * @implements IDrawable
     */
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        // FIXME: Do we insist on a ContextMonitor here.
        // We can also assume that we are OK because of the Scene - but can't assume that there is one?
        function Mesh(geometry, material, model) {
            _super.call(this, LOGGING_NAME);
            this.geometry = geometry;
            this._material = material;
            this._material.addRef();
            this.buffersByCanvasid = new NumberIUnknownMap();
            this.model = model;
        }
        Mesh.prototype.destructor = function () {
            this.geometry = void 0;
            this.buffersByCanvasid.release();
            this.buffersByCanvasid = void 0;
            this._material.release();
            this._material = void 0;
            this.model = void 0;
        };
        Mesh.prototype.draw = function (canvasId) {
            // We know we are going to need a "good" canvasId to perform the buffers lookup.
            // So we may as well test that condition now rather than waste information.
            // (Energy is always conserved, entropy almost always increases, its information we waste!) 
            if (isDefined(canvasId)) {
                // We're interleaving calls to different contexts!
                // FIXME: It seems that by going this route we're
                // going to be traversing the objects the same way :(?
                var self_1 = this;
                // Be careful not to call through the public API and cause addRef!
                // FIXME: Would be nice to be able to check that a block does not alter the reference count?
                var material = self_1._material;
                var model = self_1.model;
                var buffers = this.buffersByCanvasid.getWeakReference(canvasId);
                if (isDefined(buffers)) {
                    material.use(canvasId);
                    model.setUniforms(material, canvasId);
                    // FIXME Does canvasId affect the next steps?...
                    // Nope! We've already picked it by canvas.
                    buffers.bind(material /*, aNameToKeyName*/); // FIXME: Why not part of the API.
                    buffers.draw();
                    buffers.unbind();
                }
            }
        };
        Mesh.prototype.contextFree = function (canvasId) {
            this._material.contextFree(canvasId);
        };
        Mesh.prototype.contextGain = function (manager) {
            // 1. Replace the existing buffers if we have geometry. 
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
        Mesh.prototype.contextLost = function (canvasId) {
            this._material.contextLost(canvasId);
        };
        Object.defineProperty(Mesh.prototype, "material", {
            /**
             * @property material
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
        return Mesh;
    })(Shareable);
    return Mesh;
});
