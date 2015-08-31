define(["require", "exports", '../uniforms/Node', '../objects/primitive', '../mesh/vortexMesh', '../programs/smartProgram'], function (require, exports, Node, primitive, vortexMesh, smartProgram) {
    function vortex(ambients) {
        var mesh = vortexMesh();
        var model = new Node();
        var program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return primitive(mesh, program, model);
    }
    return vortex;
});
