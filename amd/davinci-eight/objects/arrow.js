define(["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/arrowMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, arrowMesh, smartProgram) {
    function arrow(ambients) {
        var mesh = arrowMesh();
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return arrow;
});
