define(["require", "exports", '../uniforms/StandardModel', '../objects/drawableModel', '../mesh/sphereMesh', '../programs/smartProgram'], function (require, exports, StandardModel, drawableModel, sphereMesh, smartProgram) {
    function sphere(ambients, options) {
        var mesh = sphereMesh(options);
        var model = new StandardModel();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return sphere;
});
