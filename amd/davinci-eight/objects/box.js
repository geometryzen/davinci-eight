define(["require", "exports", '../uniforms/StandardModel', '../objects/drawableModel', '../mesh/boxMesh', '../programs/smartProgram'], function (require, exports, StandardModel, drawableModel, boxMesh, smartProgram) {
    function box(ambients, options) {
        var mesh = boxMesh(options);
        var model = new StandardModel();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return box;
});
