define(["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/boxMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, boxMesh, smartProgram) {
    function box(ambients, options) {
        var mesh = boxMesh(options);
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return box;
});
