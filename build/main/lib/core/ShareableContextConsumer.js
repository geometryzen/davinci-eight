"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareableContextConsumer = void 0;
var tslib_1 = require("tslib");
var mustBeNonNullObject_1 = require("../checks/mustBeNonNullObject");
var ShareableBase_1 = require("./ShareableBase");
/**
 *
 */
var ShareableContextConsumer = /** @class */ (function (_super) {
    tslib_1.__extends(ShareableContextConsumer, _super);
    /**
     *
     */
    function ShareableContextConsumer(contextManager) {
        var _this = _super.call(this) || this;
        _this.contextManager = contextManager;
        /**
         * Keep track of subscription state
         */
        _this.isSubscribed = false;
        // The buck stops here so we must assert the existence of the contextManager. 
        mustBeNonNullObject_1.mustBeNonNullObject('contextManager', contextManager);
        _this.setLoggingName('ShareableContextConsumer');
        contextManager.addRef();
        _this.subscribe(false);
        return _this;
    }
    /**
     *
     */
    ShareableContextConsumer.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('ShareableContextConsumer');
        this.contextManager.addRef();
        this.subscribe(false);
    };
    /**
     *
     */
    ShareableContextConsumer.prototype.destructor = function (levelUp) {
        this.unsubscribe(false);
        this.contextManager.release();
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     * Instructs the consumer to subscribe to context events.
     *
     * This method is idempotent; calling it more than once with the same <code>ContextManager</code> does not change the state.
     */
    ShareableContextConsumer.prototype.subscribe = function (synchUp) {
        if (!this.isSubscribed) {
            this.contextManager.addContextListener(this);
            this.isSubscribed = true;
            if (synchUp) {
                this.synchUp();
            }
        }
    };
    /**
     * Instructs the consumer to unsubscribe from context events.
     *
     * This method is idempotent; calling it more than once does not change the state.
     */
    ShareableContextConsumer.prototype.unsubscribe = function (cleanUp) {
        if (this.isSubscribed) {
            this.contextManager.removeContextListener(this);
            this.isSubscribed = false;
            if (cleanUp) {
                this.cleanUp();
            }
        }
    };
    /**
     *
     */
    ShareableContextConsumer.prototype.synchUp = function () {
        this.contextManager.synchronize(this);
    };
    /**
     *
     */
    ShareableContextConsumer.prototype.cleanUp = function () {
        if (this.gl) {
            if (this.gl.isContextLost()) {
                this.contextLost();
            }
            else {
                this.contextFree();
            }
        }
        else {
            // There is no contextProvider so resources should already be clean.
        }
    };
    ShareableContextConsumer.prototype.contextFree = function () {
        // Do nothing.
    };
    ShareableContextConsumer.prototype.contextGain = function () {
        // Do nothing.
    };
    ShareableContextConsumer.prototype.contextLost = function () {
        // Do nothing.
    };
    Object.defineProperty(ShareableContextConsumer.prototype, "gl", {
        /**
         * Provides access to the underlying WebGL context.
         */
        get: function () {
            return this.contextManager.gl;
        },
        enumerable: false,
        configurable: true
    });
    return ShareableContextConsumer;
}(ShareableBase_1.ShareableBase));
exports.ShareableContextConsumer = ShareableContextConsumer;
