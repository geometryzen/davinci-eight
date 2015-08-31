define(["require", "exports", '../uniforms/Node', '../objects/primitive', '../mesh/sphereMesh', '../programs/smartProgram'], function (require, exports, Node, primitive, sphereMesh, smartProgram) {
    function sphere(ambients, options) {
        var mesh = sphereMesh(options);
        var model = new Node();
        // TODO: Inject a program manager.
        // Would be nice to have dependency injection?
        var program = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return primitive(mesh, program, model);
    }
    return sphere;
});
