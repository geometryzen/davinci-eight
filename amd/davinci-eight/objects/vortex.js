define(["require", "exports", '../uniforms/StandardModel', '../objects/drawableModel', '../mesh/vortexMesh', '../programs/smartProgram'], function (require, exports, StandardModel, drawableModel, vortexMesh, smartProgram) {
    function vortex(ambients) {
        var mesh = vortexMesh();
        var model = new StandardModel();
        var shaders = smartProgram(mesh.getAttributeMetaInfos(), [model.getUniformMetaInfos(), ambients.getUniformMetaInfos()]);
        return drawableModel(mesh, shaders, model);
    }
    return vortex;
});
