var DrawMode = require('../core/DrawMode');
function adapterOptions(options) {
    var drawMode = options.wireFrame ? DrawMode.LINES : DrawMode.TRIANGLES;
    return {
        drawMode: drawMode
    };
}
module.exports = adapterOptions;
