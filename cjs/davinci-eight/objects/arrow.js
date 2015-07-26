var ModelMatrixUniformProvider = require('../uniforms/ModelMatrixUniformProvider');
var drawableModel = require('../objects/drawableModel');
var arrowMesh = require('../mesh/arrowMesh');
var smartProgram = require('../programs/smartProgram');
function arrow(ambients) {
    var mesh = arrowMesh();
    var model = new ModelMatrixUniformProvider();
    var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = arrow;
