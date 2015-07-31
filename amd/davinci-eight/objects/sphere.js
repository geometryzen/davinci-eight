define(["require", "exports", '../uniforms/Node', '../objects/drawableModel', '../mesh/sphereMesh', '../programs/smartProgram'], function (require, exports, Node, drawableModel, sphereMesh, smartProgram) {
    function sphere(ambients, options) {
        var mesh = sphereMesh(options);
        var model = new Node();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return sphere;
});
