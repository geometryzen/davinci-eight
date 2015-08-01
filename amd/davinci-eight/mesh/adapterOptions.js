define(["require", "exports", '../core/DrawMode', '../core/Symbolic'], function (require, exports, DrawMode, Symbolic) {
    function adapterOptions(options) {
        if (options === void 0) { options = {
            wireFrame: false
        }; }
        var drawMode = options.wireFrame ? DrawMode.LINES : DrawMode.TRIANGLES;
        var elementUsage = options.elementUsage;
        var positionVarName = options.positionVarName || Symbolic.ATTRIBUTE_POSITION;
        var normalVarName = options.normalVarName || Symbolic.ATTRIBUTE_NORMAL;
        return {
            drawMode: drawMode,
            elementUsage: elementUsage,
            positionVarName: positionVarName,
            normalVarName: normalVarName
        };
    }
    return adapterOptions;
});
