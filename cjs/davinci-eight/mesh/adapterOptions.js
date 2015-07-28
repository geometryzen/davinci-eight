var DrawMode = require('../core/DrawMode');
function adapterOptions(options) {
    if (options === void 0) { options = { wireFrame: false }; }
    var drawMode = options.wireFrame ? DrawMode.LINES : DrawMode.TRIANGLES;
    return {
        drawMode: drawMode
    };
}
module.exports = adapterOptions;
