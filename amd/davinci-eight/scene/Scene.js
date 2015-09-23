define(["require", "exports", '../scene/createDrawList', '../scene/MonitorList', '../utils/refChange', '../utils/uuid4'], function (require, exports, createDrawList, MonitorList, refChange, uuid4) {
    var LOGGING_NAME = 'Scene';
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    /**
     * @class Scene
     * @extends IDrawList
     */
    // FIXME: extend Shareable
    var Scene = (function () {
        // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
        /**
         * @class Scene
         * @constructor
         * @param monitors [ContextMonitor[]=[]]
         */
        function Scene(monitors) {
            if (monitors === void 0) { monitors = []; }
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
                this._drawList.release();
                this._drawList = void 0;
                this.monitors.removeContextListener(this);
                this.monitors = void 0;
                this._refCount = void 0;
                this._uuid = void 0;
                return 0;
            }
            else {
                return this._refCount;
            }
        };
        Scene.prototype.remove = function (drawable) {
            this._drawList.remove(drawable);
        };
        Scene.prototype.traverse = function (callback, canvasId, prolog) {
            this._drawList.traverse(callback, canvasId, prolog);
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
        return Scene;
    })();
    return Scene;
});
