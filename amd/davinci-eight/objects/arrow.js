define(["require", "exports", '../uniforms/Node', '../objects/drawableModel', '../mesh/arrowMesh', '../programs/smartProgram'], function (require, exports, Node, drawableModel, arrowMesh, smartProgram) {
    function arrow(ambients, options) {
        var mesh = arrowMesh(options);
        var model = new Node(options);
        var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return drawableModel(mesh, shaders, model);
    }
    return arrow;
});
