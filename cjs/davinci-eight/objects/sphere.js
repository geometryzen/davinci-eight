var Node = require('../uniforms/Node');
var drawableModel = require('../objects/drawableModel');
var sphereMesh = require('../mesh/sphereMesh');
var smartProgram = require('../programs/smartProgram');
function sphere(ambients, options) {
    var mesh = sphereMesh(options);
    var model = new Node();
    var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
    return drawableModel(mesh, shaders, model);
}
module.exports = sphere;
