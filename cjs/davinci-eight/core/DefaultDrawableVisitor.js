var DefaultDrawableVisitor = (function () {
    function DefaultDrawableVisitor() {
    }
    DefaultDrawableVisitor.prototype.primitive = function (mesh, program, model) {
        if (mesh.dynamic) {
            mesh.update();
        }
        program.use();
        // TODO: What is the overhead?
        program.setUniforms(model.getUniformData());
        program.setAttributes(mesh.getAttribData());
        mesh.draw();
        for (var name in program.attributeLocations) {
            program.attributeLocations[name].disable();
        }
    };
    return DefaultDrawableVisitor;
})();
module.exports = DefaultDrawableVisitor;
