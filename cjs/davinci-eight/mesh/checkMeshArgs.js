function checkMeshArgs(options) {
    options = options || {};
    var wireFrame = typeof options.wireFrame === 'undefined' ? false : options.wireFrame;
    return {
        wireFrame: wireFrame
    };
}
module.exports = checkMeshArgs;
