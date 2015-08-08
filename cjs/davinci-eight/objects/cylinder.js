var Node = require('../uniforms/Node');
var primitive = require('../objects/primitive');
var cylinderMesh = require('../mesh/cylinderMesh');
var smartProgram = require('../programs/smartProgram');
function cylinder(ambients, options) {
    var mesh = cylinderMesh(options);
    var model = new Node();
    var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
    return primitive(mesh, shaders, model);
}
module.exports = cylinder;
