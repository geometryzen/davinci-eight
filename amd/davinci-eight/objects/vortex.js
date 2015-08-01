define(["require", "exports", '../uniforms/Node', '../objects/drawableModel', '../mesh/vortexMesh', '../programs/smartProgram'], function (require, exports, Node, drawableModel, vortexMesh, smartProgram) {
    function vortex(ambients) {
        var mesh = vortexMesh();
        var model = new Node();
        var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return drawableModel(mesh, shaders, model);
    }
    return vortex;
});
