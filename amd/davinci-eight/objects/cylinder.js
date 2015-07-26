define(["require", "exports", '../uniforms/ModelMatrixUniformProvider', '../objects/drawableModel', '../mesh/cylinderMesh', '../programs/smartProgram'], function (require, exports, ModelMatrixUniformProvider, drawableModel, cylinderMesh, smartProgram) {
    function cylinder(ambients) {
        var mesh = cylinderMesh();
        var model = new ModelMatrixUniformProvider();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return cylinder;
});
