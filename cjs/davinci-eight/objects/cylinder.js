var ModelMatrixUniformProvider = require('../uniforms/ModelMatrixUniformProvider');
var drawableModel = require('../objects/drawableModel');
var cylinderMesh = require('../mesh/cylinderMesh');
var smartProgram = require('../programs/smartProgram');
function cylinder(ambients) {
    var mesh = cylinderMesh();
    var model = new ModelMatrixUniformProvider();
    var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = cylinder;
