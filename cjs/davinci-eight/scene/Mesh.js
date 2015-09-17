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
        this.meshes = new NumberIUnknownMap();
        this.model = model;
        refChange(this._uuid, LOGGING_NAME, +1);
        // 1. Apply subdivide and boundary if needed, acting on simplices.
        // 2. Check the geometry to produce the geometry info.
        // 3 Compute DrawElements from the Simplex geometry.
        // 4 Wait for contextGain.
        //    var simplices = Simplex.subdivide(geometry.simplices, 2);
        //    simplices = Simplex.boundary(simplices, 1);
        //    let geometryInfo: GeometryInfo = checkGeometry(simplices);
        //    this.elements = toDrawElements(simplices, geometryInfo);
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
            this.meshes.release();
            this.meshes = void 0;
            this._material.release();
            this._material = void 0;
        }
        return this._refCount;
    };
    Mesh.prototype.draw = function () {
        console.warn("Mesh.draw() needs canvas id");
        // FIXME: We need a canvasID;
        var canvasId = void 0;
        var mesh = this.meshes.get(canvasId);
        if (mesh) {
            this.material.use(canvasId);
            this.model.accept(this._material);
            mesh.bind(this._material);
            mesh.draw();
            mesh.unbind();
            mesh.release();
        }
        else {
            console.warn(LOGGING_NAME + " draw method has mesh or canvasId, canvasId => " + canvasId);
        }
    };
    Mesh.prototype.contextFree = function (canvasId) {
        this._material.contextFree(canvasId);
    };
    Mesh.prototype.contextGain = function (manager) {
        // 5. create the mesh and cache the IMesh result.
        if (this.elements) {
            var mesh = manager.createDrawElementsMesh(this.elements);
            this.meshes.put(manager.canvasId, mesh);
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
