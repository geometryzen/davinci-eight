define(["require", "exports", '../uniforms/LocalModel', '../objects/drawableModel', '../mesh/vortexMesh', '../programs/smartProgram'], function (require, exports, LocalModel, drawableModel, vortexMesh, smartProgram) {
    function vortex(ambients) {
        var mesh = vortexMesh();
        var model = new LocalModel();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return vortex;
});
