var StandardModel = require('../uniforms/StandardModel');
var drawableModel = require('../objects/drawableModel');
var arrowMesh = require('../mesh/arrowMesh');
var smartProgram = require('../programs/smartProgram');
function arrow(ambients, options) {
    var mesh = arrowMesh(options);
    var model = new StandardModel();
    var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = arrow;
