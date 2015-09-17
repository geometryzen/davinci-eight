define(["require", "exports", '../scene/MonitorList', '../scene/createDrawList', '../utils/refChange', '../utils/uuid4'], function (require, exports, MonitorList, createDrawList, refChange, uuid4) {
    var LOGGING_NAME = 'Scene';
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    /**
     * @module EIGHT
     * @class Scene
     * @implements IDrawList
     */
    var Scene = (function () {
        // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
        function Scene(monitors) {
            this._drawList = createDrawList();
            this._refCount = 1;
            this._uuid = uuid4().generate();
            MonitorList.verify('monitors', monitors, ctorContext);
            this.monitors = new MonitorList(monitors);
            this.monitors.addContextListener(this);
            refChange(this._uuid, LOGGING_NAME, +1);
        }
        Scene.prototype.add = function (drawable) {
            this._drawList.add(drawable);
        };
        Scene.prototype.addRef = function () {
            this._refCount++;
            refChange(this._uuid, LOGGING_NAME, +1);
            return this._refCount;
        };
        Scene.prototype.release = function () {
            this._refCount--;
            refChange(this._uuid, LOGGING_NAME, -1);
            if (this._refCount === 0) {
                this.monitors.removeContextListener(this);
                this.monitors = void 0;
                this._drawList.release();
                this._drawList = void 0;
            }
            return this._refCount;
        };
        Scene.prototype.remove = function (drawable) {
            this._drawList.remove(drawable);
        };
        Scene.prototype.traverse = function (callback) {
            this._drawList.traverse(callback);
        };
        Scene.prototype.contextFree = function (canvasId) {
            this._drawList.contextFree(canvasId);
        };
        Scene.prototype.contextGain = function (manager) {
            this._drawList.contextGain(manager);
        };
        Scene.prototype.contextLoss = function (canvasId) {
            this._drawList.contextLoss(canvasId);
        };
        Scene.prototype.uniform1f = function (name, x) {
            this._drawList.uniform1f(name, x);
        };
        Scene.prototype.uniform2f = function (name, x, y) {
            this._drawList.uniform2f(name, x, y);
        };
        Scene.prototype.uniform3f = function (name, x, y, z) {
            this._drawList.uniform3f(name, x, y, z);
        };
        Scene.prototype.uniform4f = function (name, x, y, z, w) {
            this._drawList.uniform4f(name, x, y, z, w);
        };
        Scene.prototype.uniformMatrix1 = function (name, transpose, matrix) {
            this._drawList.uniformMatrix1(name, transpose, matrix);
        };
        Scene.prototype.uniformMatrix2 = function (name, transpose, matrix) {
            this._drawList.uniformMatrix2(name, transpose, matrix);
        };
        Scene.prototype.uniformMatrix3 = function (name, transpose, matrix) {
            this._drawList.uniformMatrix3(name, transpose, matrix);
        };
        Scene.prototype.uniformMatrix4 = function (name, transpose, matrix) {
            this._drawList.uniformMatrix4(name, transpose, matrix);
        };
        Scene.prototype.uniformVector1 = function (name, vector) {
            this._drawList.uniformVector1(name, vector);
        };
        Scene.prototype.uniformVector2 = function (name, vector) {
            this._drawList.uniformVector2(name, vector);
        };
        Scene.prototype.uniformVector3 = function (name, vector) {
            this._drawList.uniformVector3(name, vector);
        };
        Scene.prototype.uniformVector4 = function (name, vector) {
            this._drawList.uniformVector4(name, vector);
        };
        return Scene;
    })();
    return Scene;
});
