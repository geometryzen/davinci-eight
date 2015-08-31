var Node = require('../uniforms/Node');
var primitive = require('../objects/primitive');
var boxMesh = require('../mesh/boxMesh');
var smartProgram = require('../programs/smartProgram');
function box(ambients, options) {
    var mesh = boxMesh(options);
    var model = new Node();
    var program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
    return primitive(mesh, program, model);
}
module.exports = box;
