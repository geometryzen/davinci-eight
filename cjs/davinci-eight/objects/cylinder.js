var StandardModel = require('../uniforms/StandardModel');
var drawableModel = require('../objects/drawableModel');
var cylinderMesh = require('../mesh/cylinderMesh');
var smartProgram = require('../programs/smartProgram');
function cylinder(ambients) {
    var mesh = cylinderMesh();
    var model = new StandardModel();
    var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = cylinder;
