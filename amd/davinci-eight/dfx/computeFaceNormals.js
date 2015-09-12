define(["require", "exports", '../checks/expectArg', '../core/Symbolic', '../math/Vector3'], function (require, exports, expectArg, Symbolic, Vector3) {
    function computeFaceNormals(simplex) {
        // TODO: Optimize so that we don't create temporaries.
        // Use static functions on Vector3 to compute cross product by component.
        expectArg('simplex', simplex).toBeObject();
        expectArg('name', name).toBeString();
        var vertex0 = simplex.vertices[0].attributes;
        var vertex1 = simplex.vertices[1].attributes;
        var vertex2 = simplex.vertices[2].attributes;
        var vA = new Vector3(vertex0[Symbolic.ATTRIBUTE_POSITION].data);
        var vB = new Vector3(vertex1[Symbolic.ATTRIBUTE_POSITION].data);
        var vC = new Vector3(vertex2[Symbolic.ATTRIBUTE_POSITION].data);
        var cb = new Vector3().subVectors(vC, vB);
        var ab = new Vector3().subVectors(vA, vB);
        var normal = new Vector3().crossVectors(cb, ab).normalize();
        vertex0[Symbolic.ATTRIBUTE_NORMAL] = normal;
        vertex1[Symbolic.ATTRIBUTE_NORMAL] = normal;
        vertex2[Symbolic.ATTRIBUTE_NORMAL] = normal;
    }
    return computeFaceNormals;
});
