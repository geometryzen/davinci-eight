define(["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/sphereMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, sphereMesh, smartProgram) {
    function sphere(ambients, options) {
        var mesh = sphereMesh(options);
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return sphere;
});
