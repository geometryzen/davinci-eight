// This function has the important side-effect of setting the vertex index property.
function uniqueVertices(simplices) {
    var map = {};
    var uniques = [];
    function munge(vertex) {
        var key = vertex.toString();
        if (map[key]) {
            var existing = map[key];
            vertex.index = existing.index;
        }
        else {
            vertex.index = uniques.length;
            uniques.push(vertex);
            map[key] = vertex;
        }
    }
    simplices.forEach(function (simplex) {
        simplex.vertices.forEach(function (vertex) {
            munge(vertex);
        });
    });
    return uniques;
}
module.exports = uniqueVertices;
