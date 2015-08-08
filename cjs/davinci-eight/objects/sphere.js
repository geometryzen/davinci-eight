var Node = require('../uniforms/Node');
var primitive = require('../objects/primitive');
var sphereMesh = require('../mesh/sphereMesh');
var smartProgram = require('../programs/smartProgram');
function sphere(ambients, options) {
    var mesh = sphereMesh(options);
    var model = new Node();
    var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
    return primitive(mesh, shaders, model);
}
module.exports = sphere;
