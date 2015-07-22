define(["require", "exports"], function (require, exports) {
    function checkMeshArgs(options) {
        options = options || {};
        var wireFrame = typeof options.wireFrame === 'undefined' ? false : options.wireFrame;
        return {
            wireFrame: wireFrame
        };
    }
    return checkMeshArgs;
});
