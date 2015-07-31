define(["require", "exports", '../uniforms/StandardModel', '../objects/drawableModel', '../mesh/cylinderMesh', '../programs/smartProgram'], function (require, exports, StandardModel, drawableModel, cylinderMesh, smartProgram) {
    function cylinder(ambients) {
        var mesh = cylinderMesh();
        var model = new StandardModel();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return cylinder;
});
