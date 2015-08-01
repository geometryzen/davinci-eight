define(["require", "exports", '../uniforms/Node', '../objects/drawableModel', '../mesh/boxMesh', '../programs/smartProgram'], function (require, exports, Node, drawableModel, boxMesh, smartProgram) {
    function box(ambients, options) {
        var mesh = boxMesh(options);
        var model = new Node();
        var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return drawableModel(mesh, shaders, model);
    }
    return box;
});
