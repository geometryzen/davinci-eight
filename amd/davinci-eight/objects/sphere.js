define(["require", "exports", '../uniforms/Node', '../objects/primitive', '../mesh/sphereMesh', '../programs/smartProgram'], function (require, exports, Node, primitive, sphereMesh, smartProgram) {
    function sphere(ambients, options) {
        var mesh = sphereMesh(options);
        var model = new Node();
        var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return primitive(mesh, shaders, model);
    }
    return sphere;
});
