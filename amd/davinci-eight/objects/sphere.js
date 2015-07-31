define(["require", "exports", '../uniforms/LocalModel', '../objects/drawableModel', '../mesh/sphereMesh', '../programs/smartProgram'], function (require, exports, LocalModel, drawableModel, sphereMesh, smartProgram) {
    function sphere(ambients, options) {
        var mesh = sphereMesh(options);
        var model = new LocalModel();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return sphere;
});
