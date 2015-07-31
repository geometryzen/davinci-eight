define(["require", "exports", '../uniforms/LocalModel', '../objects/drawableModel', '../mesh/boxMesh', '../programs/smartProgram'], function (require, exports, LocalModel, drawableModel, boxMesh, smartProgram) {
    function box(ambients, options) {
        var mesh = boxMesh(options);
        var model = new LocalModel();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return box;
});
