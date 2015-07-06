define(["require", "exports", '../worlds/world'], function (require, exports, world) {
    var Scene = (function () {
        function Scene() {
            this.world = world();
        }
        Scene.prototype.add = function (drawable) {
            return this.world.add(drawable);
        };
        Object.defineProperty(Scene.prototype, "drawGroups", {
            get: function () {
                return this.world.drawGroups;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.contextFree = function (context) {
            return this.world.contextFree(context);
        };
        Scene.prototype.contextGain = function (context, contextId) {
            return this.world.contextGain(context, contextId);
        };
        Scene.prototype.contextLoss = function () {
            return this.world.contextLoss();
        };
        Scene.prototype.hasContext = function () {
            return this.world.hasContext();
        };
        return Scene;
    })();
    return Scene;
});
