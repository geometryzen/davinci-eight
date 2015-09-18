var NumberIUnknownMap = require('../utils/NumberIUnknownMap');
var refChange = require('../utils/refChange');
var uuid4 = require('../utils/uuid4');
/**
 * Name used for reference count monitoring and logging.
 */
var LOGGING_NAME = 'Mesh';
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
        // We're interleaving calls to different contexts!
        // FIXME: It seems that by going this route we're
        // going to be traversing the objects the same way :(?
        var self = this;
        // Be careful not to call through the public API and cause addRef!
        // FIXME: Would be nice to be able to check that a block does not alter the reference count?
        var material = self._material;
        var model = self.model;
        var mesh = this.meshLookup.get(canvasId);
        material.use(canvasId);
        model.accept(material);
        mesh.bind(material /*, aNameToKeyName*/); // FIXME: Why not part of the API.
        mesh.draw();
        mesh.unbind();
        mesh.release();
    };
    Mesh.prototype.contextFree = function (canvasId) {
        this._material.contextFree(canvasId);
    };
    Mesh.prototype.contextGain = function (manager) {
        var geometry = this.geometry;
        if (geometry) {
            var elements = geometry.elements;
            var metadata = geometry.metadata;
            var mesh = manager.createDrawElementsMesh(elements);
            this.meshLookup.put(manager.canvasId, mesh);
            mesh.release();
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
module.exports = Mesh;
