import { Simplex } from './Simplex';
import { Vertex } from '../atoms/Vertex';

// This function has the important side-effect of setting the vertex index property.
export function computeUniqueVertices(geometry: Simplex[]): Vertex[] {

    let map: { [key: string]: Vertex } = {};
    let vertices: Vertex[] = [];

    function munge(vertex: Vertex) {
        let key = vertex.toString();
        if (map[key]) {
            let existing = map[key];
            vertex.index = existing.index;
        }
        else {
            vertex.index = vertices.length;
            vertices.push(vertex);
            map[key] = vertex;
        }
    }

    geometry.forEach(function (simplex: Simplex) {
        simplex.vertices.forEach(function (vertex: Vertex) {
            munge(vertex);
        });
    });

    return vertices;
}
