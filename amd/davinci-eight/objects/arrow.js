define(["require", "exports", '../uniforms/StandardModel', '../objects/drawableModel', '../mesh/arrowMesh', '../programs/smartProgram'], function (require, exports, StandardModel, drawableModel, arrowMesh, smartProgram) {
    function arrow(ambients, options) {
        var mesh = arrowMesh(options);
        var model = new StandardModel();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return arrow;
});
