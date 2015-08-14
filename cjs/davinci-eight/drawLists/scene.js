var expectArg = require('../checks/expectArg');
var scene = function () {
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
        add: function (drawable) {
            drawables.push(drawable);
        },
        remove: function (drawable) {
            var index = drawables.indexOf(drawable);
            if (index >= 0) {
                drawables.splice(index, 1);
            }
        }
    };
    return publicAPI;
};
module.exports = scene;
