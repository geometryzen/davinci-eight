define(["require", "exports", '../uniforms/Node', '../objects/drawableModel', '../mesh/sphereMesh', '../programs/smartProgram'], function (require, exports, Node, drawableModel, sphereMesh, smartProgram) {
    function sphere(ambients, options) {
        var mesh = sphereMesh(options);
        var model = new Node();
        var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return drawableModel(mesh, shaders, model);
    }
    return sphere;
});
