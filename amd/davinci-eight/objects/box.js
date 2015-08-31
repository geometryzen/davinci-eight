define(["require", "exports", '../uniforms/Node', '../objects/primitive', '../mesh/boxMesh', '../programs/smartProgram'], function (require, exports, Node, primitive, boxMesh, smartProgram) {
    function box(ambients, options) {
        var mesh = boxMesh(options);
        var model = new Node();
        var program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return primitive(mesh, program, model);
    }
    return box;
});
