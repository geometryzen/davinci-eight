define(["require", "exports", '../uniforms/Node', '../objects/drawableModel', '../mesh/arrowMesh', '../programs/smartProgram'], function (require, exports, Node, drawableModel, arrowMesh, smartProgram) {
    function arrow(ambients, options) {
        var mesh = arrowMesh(options);
        var model = new Node();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return arrow;
});
