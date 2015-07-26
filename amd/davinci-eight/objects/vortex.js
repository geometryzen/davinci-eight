define(["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/vortexMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, vortexMesh, smartProgram) {
    function vortex(ambients) {
        var mesh = vortexMesh();
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return vortex;
});
