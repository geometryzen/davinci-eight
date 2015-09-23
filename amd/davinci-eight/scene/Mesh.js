define(["require", "exports", '../core', '../checks/isDefined', '../checks/mustBeDefined', '../utils/NumberIUnknownMap', '../utils/refChange', '../utils/uuid4'], function (require, exports, core, isDefined, mustBeDefined, NumberIUnknownMap, refChange, uuid4) {
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
    var Mesh = (function () {
        // FIXME: Do we insist on a ContextMonitor here.
        // We can also assume that we are OK because of the Scene - but can't assume that there is one?
        function Mesh(geometry, material, model) {
            this._refCount = 1;
            this._uuid = uuid4().generate();
            this.geometry = geometry;
            this._material = material;
            this._material.addRef();
            this.meshLookup = new NumberIUnknownMap();
            this.model = model;
            refChange(this._uuid, LOGGING_NAME, +1);
        }
        Mesh.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME, +1);
            return this._refCount;
        };
        Mesh.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME, -1);
            if (this._refCount === 0) {
                this.meshLookup.release();
                this.meshLookup = void 0;
                this._material.release();
                this._material = void 0;
            }
            return this._refCount;
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
                var buffers = this.meshLookup.getWeakReference(canvasId);
                if (isDefined(buffers)) {
                    material.use(canvasId);
                    model.setUniforms(material, canvasId);
                    // FIXME Does canvasId affect the next steps?...
                    // Nope! We've already picked it by canvas.
                    buffers.bind(material /*, aNameToKeyName*/); // FIXME: Why not part of the API.
                    buffers.draw();
                    buffers.unbind();
                }
                else {
                    if (core.verbose) {
                        console.warn("Mesh is unable to draw because it has not be prepared for the specified canvas. canvasId => " + canvasId);
                    }
                }
            }
            else {
                if (core.verbose) {
                    console.warn("Mesh unable to look up buffer geometry because `typeof canvasId` is " + typeof canvasId);
                }
            }
        };
        Mesh.prototype.contextFree = function (canvasId) {
            this._material.contextFree(canvasId);
        };
        Mesh.prototype.contextGain = function (manager) {
            var geometry = this.geometry;
            if (geometry) {
                var data = geometry.data;
                var meta = geometry.meta;
                mustBeDefined('geometry.data', data, contextBuilder);
                mustBeDefined('geometry.meta', meta, contextBuilder);
                // FIXME: Why is the meta not being used?
                this.meshLookup.putWeakReference(manager.canvasId, manager.createBufferGeometry(data));
                this._material.contextGain(manager);
            }
            else {
                console.warn(LOGGING_NAME + " contextGain method has no elements, canvasId => " + manager.canvasId);
            }
        };
        Mesh.prototype.contextLoss = function (canvasId) {
            this._material.contextLoss(canvasId);
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
    })();
    return Mesh;
});
