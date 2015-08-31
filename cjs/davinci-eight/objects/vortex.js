var Node = require('../uniforms/Node');
var primitive = require('../objects/primitive');
var vortexMesh = require('../mesh/vortexMesh');
var smartProgram = require('../programs/smartProgram');
function vortex(ambients) {
    var mesh = vortexMesh();
    var model = new Node();
    var program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
    return primitive(mesh, program, model);
}
module.exports = vortex;
