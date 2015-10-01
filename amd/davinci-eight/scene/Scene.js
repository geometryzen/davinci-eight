var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../scene/createDrawList', '../scene/MonitorList', '../utils/Shareable'], function (require, exports, createDrawList, MonitorList, Shareable) {
    var LOGGING_NAME = 'Scene';
    function ctorContext() {
        return LOGGING_NAME + " constructor";
    }
    /**
     * @class Scene
     * @extends Shareable
     * @extends IDrawList
     */
    var Scene = (function (_super) {
        __extends(Scene, _super);
        // FIXME: Do I need the collection, or can I be fooled into thinking there is one monitor?
        /**
         * <p>
         * A <code>Scene</code> is a collection of drawable instances arranged in some order.
         * The precise order is implementation defined.
         * The collection may be traversed for general processing using callback/visitor functions.
         * </p>
         * @class Scene
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         */
        function Scene(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, LOGGING_NAME);
            MonitorList.verify('monitors', monitors, ctorContext);
            this.drawList = createDrawList();
            this.monitors = new MonitorList(monitors);
            this.monitors.addContextListener(this);
            this.monitors.synchronize(this);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        Scene.prototype.destructor = function () {
            this.monitors.removeContextListener(this);
            this.monitors.release();
            this.monitors = void 0;
            this.drawList.release();
            this.drawList = void 0;
        };
        /**
         * <p>
         * Adds the <code>drawable</code> to this <code>Scene</code>.
         * </p>
         * @method add
         * @param drawable {IDrawable}
         * @return {Void}
         * <p>
         * This method returns <code>undefined</code>.
         * </p>
         */
        Scene.prototype.add = function (drawable) {
            this.drawList.add(drawable);
        };
        /**
         * <p>
         * Traverses the collection of drawables, drawing each one.
         * </p>
         * @method draw
         * @param ambients {IFacet[]}
         * @param canvasId {number}
         * @return {void}
         * @beta
         */
        Scene.prototype.draw = function (ambients, canvasId) {
            this.drawList.draw(ambients, canvasId);
        };
        /**
         * Gets a collection of drawable elements by name.
         * @method getDrawablesByName
         * @param name {string}
         */
        Scene.prototype.getDrawablesByName = function (name) {
            return this.drawList.getDrawablesByName(name);
        };
        /**
         * <p>
         * Removes the <code>drawable</code> from this <code>Scene</code>.
         * </p>
         * @method remove
         * @param drawable {IDrawable}
         * @return {Void}
         * <p>
         * This method returns <code>undefined</code>.
         * </p>
         */
        Scene.prototype.remove = function (drawable) {
            this.drawList.remove(drawable);
        };
        /**
         * <p>
         * Traverses the collection of drawables, calling the specified callback arguments.
         * </p>
         * @method traverse
         * @param callback {(drawable: IDrawable) => void} Callback function for each drawable.
         * @param canvasId {number} Identifies the canvas.
         * @param prolog {(material: IMaterial) => void} Callback function for each material.
         * @return {void}
         */
        Scene.prototype.traverse = function (callback, canvasId, prolog) {
            this.drawList.traverse(callback, canvasId, prolog);
        };
        Scene.prototype.contextFree = function (canvasId) {
            this.drawList.contextFree(canvasId);
        };
        Scene.prototype.contextGain = function (manager) {
            this.drawList.contextGain(manager);
        };
        Scene.prototype.contextLost = function (canvasId) {
            this.drawList.contextLost(canvasId);
        };
        return Scene;
    })(Shareable);
    return Scene;
});
