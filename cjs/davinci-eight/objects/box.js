var LocalModel = require('../uniforms/LocalModel');
var drawableModel = require('../objects/drawableModel');
var boxMesh = require('../mesh/boxMesh');
var smartProgram = require('../programs/smartProgram');
function box(ambients, options) {
    var mesh = boxMesh(options);
    var model = new LocalModel();
    var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = box;
