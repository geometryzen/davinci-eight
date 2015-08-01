define(["require", "exports", '../uniforms/Node', '../objects/drawableModel', '../mesh/cylinderMesh', '../programs/smartProgram'], function (require, exports, Node, drawableModel, cylinderMesh, smartProgram) {
    function cylinder(ambients) {
        var mesh = cylinderMesh();
        var model = new Node();
        var shaders = smartProgram(mesh.getAttribMeta(), [model.getUniformMeta(), ambients.getUniformMeta()]);
        return drawableModel(mesh, shaders, model);
    }
    return cylinder;
});
