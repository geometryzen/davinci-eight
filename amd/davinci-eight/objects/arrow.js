define(["require", "exports", '../uniforms/LocalModel', '../objects/drawableModel', '../mesh/arrowMesh', '../programs/smartProgram'], function (require, exports, LocalModel, drawableModel, arrowMesh, smartProgram) {
    function arrow(ambients, options) {
        var mesh = arrowMesh(options);
        var model = new LocalModel();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return arrow;
});
