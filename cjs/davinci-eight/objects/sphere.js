var ModelMatrixUniformProvider = require('../uniforms/ModelMatrixUniformProvider');
var drawableModel = require('../objects/drawableModel');
var sphereMesh = require('../mesh/sphereMesh');
var smartProgram = require('../programs/smartProgram');
function sphere(ambients) {
    var mesh = sphereMesh();
    var model = new ModelMatrixUniformProvider();
    var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = sphere;
