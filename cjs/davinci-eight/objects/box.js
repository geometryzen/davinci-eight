var ModelMatrixUniformProvider = require('../uniforms/ModelMatrixUniformProvider');
var drawableModel = require('../objects/drawableModel');
var boxMesh = require('../mesh/boxMesh');
var smartProgram = require('../programs/smartProgram');
function box(ambients) {
    var mesh = boxMesh();
    var model = new ModelMatrixUniformProvider();
    var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = box;
