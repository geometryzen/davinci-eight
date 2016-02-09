import PolyhedronBuilder from '../geometries/PolyhedronBuilder';

var vertices = [
    1, 0, 0, - 1, 0, 0, 0, 1, 0, 0, - 1, 0, 0, 0, 1, 0, 0, - 1
];

var indices = [
    0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2
];

export default class OctahedronSimplexGeometry extends PolyhedronBuilder {
    constructor(radius?: number, detail?: number) {
        super(vertices, indices, radius, detail);
    }
}
