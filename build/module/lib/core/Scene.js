import { __extends } from "tslib";
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { ShareableArray } from '../collections/ShareableArray';
import { ShareableContextConsumer } from '../core/ShareableContextConsumer';
/**
 * A collection of Renderable objects.
 */
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene(contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager) || this;
        _this.setLoggingName('Scene');
        mustBeNonNullObject('contextManager', contextManager);
        _this._drawables = new ShareableArray([]);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    Scene.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this._drawables.release();
        this._drawables = void 0;
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Scene.prototype.add = function (drawable) {
        mustBeNonNullObject('drawable', drawable);
        this._drawables.push(drawable);
    };
    Scene.prototype.contains = function (drawable) {
        mustBeNonNullObject('drawable', drawable);
        return this._drawables.indexOf(drawable) >= 0;
    };
    /**
     * @deprecated. Use the render method instead.
     */
    Scene.prototype.draw = function (ambients) {
        console.warn("Scene.draw is deprecated. Please use the Scene.render method instead.");
        this.render(ambients);
    };
    /**
     * Traverses the collection of Renderable objects, calling render(ambients) on each one.
     * The rendering takes place in two stages.
     * In the first stage, non-transparent objects are drawn.
     * In the second state, transparent objects are drawn.
     */
    Scene.prototype.render = function (ambients) {
        var gl = this.gl;
        if (gl) {
            var ds = this._drawables;
            var iLen = ds.length;
            /**
             * true is non-transparent objects exist.
             */
            var passOne = false;
            /**
             * true if transparent objects exist.
             */
            var passTwo = false;
            // Zeroth pass through objects determines what kind of objects exist.
            for (var i = 0; i < iLen; i++) {
                var d = ds.getWeakRef(i);
                if (d.transparent) {
                    passTwo = true;
                }
                else {
                    passOne = true;
                }
            }
            if (passOne || passTwo) {
                if (passTwo) {
                    var previousMask = gl.getParameter(gl.DEPTH_WRITEMASK);
                    if (passOne) {
                        // Render non-transparent objects in the first pass.
                        gl.depthMask(true);
                        for (var i = 0; i < iLen; i++) {
                            var d = ds.getWeakRef(i);
                            if (!d.transparent) {
                                d.render(ambients);
                            }
                        }
                    }
                    // Render transparent objects in the second pass.
                    gl.depthMask(false);
                    for (var i = 0; i < iLen; i++) {
                        var d = ds.getWeakRef(i);
                        if (d.transparent) {
                            d.render(ambients);
                        }
                    }
                    gl.depthMask(previousMask);
                }
                else {
                    // There must be non-transparent objects, render them.
                    for (var i = 0; i < iLen; i++) {
                        var d = ds.getWeakRef(i);
                        if (!d.transparent) {
                            d.render(ambients);
                        }
                    }
                }
            }
        }
    };
    Scene.prototype.find = function (match) {
        return this._drawables.find(match);
    };
    Scene.prototype.findOne = function (match) {
        return this._drawables.findOne(match);
    };
    Scene.prototype.findOneByName = function (name) {
        return this.findOne(function (drawable) { return drawable.name === name; });
    };
    Scene.prototype.findByName = function (name) {
        return this.find(function (drawable) { return drawable.name === name; });
    };
    Scene.prototype.remove = function (drawable) {
        mustBeNonNullObject('drawable', drawable);
        var index = this._drawables.indexOf(drawable);
        if (index >= 0) {
            this._drawables.splice(index, 1).release();
        }
    };
    Scene.prototype.contextFree = function () {
        for (var i = 0; i < this._drawables.length; i++) {
            var drawable = this._drawables.getWeakRef(i);
            if (drawable.contextFree) {
                drawable.contextFree();
            }
        }
        _super.prototype.contextFree.call(this);
    };
    Scene.prototype.contextGain = function () {
        for (var i = 0; i < this._drawables.length; i++) {
            var drawable = this._drawables.getWeakRef(i);
            if (drawable.contextGain) {
                drawable.contextGain();
            }
        }
        _super.prototype.contextGain.call(this);
    };
    Scene.prototype.contextLost = function () {
        for (var i = 0; i < this._drawables.length; i++) {
            var drawable = this._drawables.getWeakRef(i);
            if (drawable.contextLost) {
                drawable.contextLost();
            }
        }
        _super.prototype.contextLost.call(this);
    };
    return Scene;
}(ShareableContextConsumer));
export { Scene };
