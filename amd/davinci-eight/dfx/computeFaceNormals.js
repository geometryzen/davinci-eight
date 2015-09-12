define(["require", "exports", '../checks/expectArg', '../core/Symbolic', '../math/Vector3'], function (require, exports, expectArg, Symbolic, Vector3) {
    function computeFaceNormals(simplex) {
        expectArg('simplex', simplex).toBeObject();
        expectArg('name', name).toBeString();
        var vertex0 = simplex.vertices[0];
        var vertex1 = simplex.vertices[1];
        var vertex2 = simplex.vertices[2];
        var vA = new Vector3(vertex0.position.data);
        var vB = new Vector3(vertex1.position.data);
        var vC = new Vector3(vertex2.position.data);
        var cb = new Vector3().subVectors(vC, vB);
        var ab = new Vector3().subVectors(vA, vB);
        var normal = new Vector3().crossVectors(cb, ab).normalize();
        vertex0.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
        vertex1.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
        vertex2.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
    }
    return computeFaceNormals;
});
