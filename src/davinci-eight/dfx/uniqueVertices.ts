import Simplex = require('../dfx/Simplex');
import Vertex = require('../dfx/Vertex');

// This function has the important side-effect of setting the vertex index property.
function uniqueVertices(simplices: Simplex[]): Vertex[] {

  let map: { [key:string]: Vertex } = {};
  let uniques: Vertex[] = [];

  function munge(vertex: Vertex) {
    let key = vertex.toString();
    if (map[key]) {
      let existing = map[key];
      vertex.index = existing.index;
    }
    else {
      vertex.index = uniques.length;
      uniques.push(vertex);
      map[key] = vertex;
    }
  }

  simplices.forEach(function(simplex: Simplex) {
    simplex.vertices.forEach(function(vertex: Vertex) {
      munge(vertex);
    });
  });

  return uniques;
}

export = uniqueVertices;
