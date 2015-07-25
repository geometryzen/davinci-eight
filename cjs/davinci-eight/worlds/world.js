var expectArg = require('../checks/expectArg');
var world = function () {
    var drawables = [];
    var drawGroups = {};
    var gl;
    var contextId;
    var publicAPI = {
        get drawGroups() { return drawGroups; },
        get children() { return drawables; },
        contextFree: function () {
            drawables.forEach(function (drawable) {
                drawable.contextFree();
            });
            gl = void 0;
            contextId = void 0;
        },
        contextGain: function (context, contextId) {
            expectArg('context', context).toSatisfy(context instanceof WebGLRenderingContext, "context must implement WebGLRenderingContext");
            expectArg('contextId', contextId).toBeString();
            gl = context;
            contextId = contextId;
            drawables.forEach(function (drawable) {
                drawable.contextGain(context, contextId);
                var groupName = drawable.drawGroupName;
                if (!drawGroups[groupName]) {
                    drawGroups[groupName] = [];
                }
                drawGroups[groupName].push(drawable);
            });
        },
        contextLoss: function () {
            drawables.forEach(function (drawable) {
                drawable.contextLoss();
            });
            gl = void 0;
            contextId = void 0;
        },
        hasContext: function () {
            return !!gl;
        },
        add: function (child) {
            drawables.push(child);
        }
    };
    return publicAPI;
};
module.exports = world;
