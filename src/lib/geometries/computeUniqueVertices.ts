import { Vertex } from "../atoms/Vertex";
import { Simplex } from "./Simplex";

// This function has the important side-effect of setting the vertex index property.
/**
 * @hidden
 */
export function computeUniqueVertices(geometry: Simplex[]): Vertex[] {
    const map: { [key: string]: Vertex } = {};
    const vertices: Vertex[] = [];

    function munge(vertex: Vertex) {
        const key = vertex.toString();
        if (map[key]) {
            const existing = map[key];
            vertex.index = existing.index;
        } else {
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
