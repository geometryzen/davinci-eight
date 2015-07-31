var Node = require('../uniforms/Node');
var drawableModel = require('../objects/drawableModel');
var vortexMesh = require('../mesh/vortexMesh');
var smartProgram = require('../programs/smartProgram');
function vortex(ambients) {
    var mesh = vortexMesh();
    var model = new Node();
    var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = vortex;
