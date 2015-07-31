define(["require", "exports", '../uniforms/Node', '../objects/drawableModel', '../mesh/vortexMesh', '../programs/smartProgram'], function (require, exports, Node, drawableModel, vortexMesh, smartProgram) {
    function vortex(ambients) {
        var mesh = vortexMesh();
        var model = new Node();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return vortex;
});
