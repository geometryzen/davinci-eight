var Node = require('../uniforms/Node');
var drawableModel = require('../objects/drawableModel');
var arrowMesh = require('../mesh/arrowMesh');
var smartProgram = require('../programs/smartProgram');
function arrow(ambients, options) {
    var mesh = arrowMesh(options);
    var model = new Node(options);
    var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = arrow;
