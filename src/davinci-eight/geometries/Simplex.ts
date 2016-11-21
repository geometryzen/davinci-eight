import mustBeEQ from '../checks/mustBeEQ';
import mustBeGE from '../checks/mustBeGE';
import mustBeLE from '../checks/mustBeLE';
import mustBeInteger from '../checks/mustBeInteger';
import Vertex from '../atoms/Vertex';
import VertexAttributeMap from '../atoms/VertexAttributeMap';
import { VectorN } from '../math/VectorN';

function checkIntegerArg(name: string, n: number, min: number, max: number): number {
    mustBeInteger(name, n);
    mustBeGE(name, n, min);
    mustBeLE(name, n, max);
    return n;
}
function checkCountArg(count: number): number {
    // TODO: The count range should depend upon the k value of the simplex.
    return checkIntegerArg('count', count, 0, 7);
}

function concatReduce(a: Simplex[], b: Simplex[]): Simplex[] {
    return a.concat(b);
}

function lerp(a: number[], b: number[], alpha: number, data: number[] = []): number[] {
    mustBeEQ('a.length', a.length, b.length);
    const dims = a.length;
    var i: number;
    let beta = 1 - alpha;
    for (i = 0; i < dims; i++) {
        data.push(beta * a[i] + alpha * b[i]);
    }
    return data;
}

function lerpVertexAttributeMap(a: VertexAttributeMap, b: VertexAttributeMap, alpha: number): VertexAttributeMap {

    let attribMap: VertexAttributeMap = {};

    let keys = Object.keys(a);
    let keysLength = keys.length;
    for (var k = 0; k < keysLength; k++) {
        let key = keys[k];
        attribMap[key] = lerpVectorN(a[key], b[key], alpha);
    }
    return attribMap;
}

function lerpVectorN(a: VectorN<number>, b: VectorN<number>, alpha: number): VectorN<number> {
    return new VectorN<number>(lerp(a.coords, b.coords, alpha));
}

export default class Simplex {
    public vertices: Vertex[] = [];
    constructor(k: number) {
        mustBeInteger('k', k);
        const numVertices: number = k + 1;
        const numCoordinates = 0;
        for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex(numCoordinates));
        }
    }
    get k(): number {
        return this.vertices.length - 1;
    }
    // These symbolic constants represent the correct k values for various low-dimesional simplices. 
    // The number of vertices in a k-simplex is k + 1.
    public static EMPTY = -1;
    public static POINT = 0;
    public static LINE = 1;
    public static TRIANGLE = 2;
    public static TETRAHEDRON = 3;
    public static FIVE_CELL = 4;
    public static indices(simplex: Simplex): number[] {
        return simplex.vertices.map(function (vertex) { return vertex.index; });
    }
    private static boundaryMap(simplex: Simplex): Simplex[] {
        const vertices = simplex.vertices;
        const k = simplex.k;
        if (k === Simplex.TRIANGLE) {
            var line01 = new Simplex(k - 1);
            line01.vertices[0].attributes = vertices[0].attributes;
            line01.vertices[1].attributes = vertices[1].attributes;

            var line12 = new Simplex(k - 1);
            line12.vertices[0].attributes = vertices[1].attributes;
            line12.vertices[1].attributes = vertices[2].attributes;

            var line20 = new Simplex(k - 1);
            line20.vertices[0].attributes = vertices[2].attributes;
            line20.vertices[1].attributes = vertices[0].attributes;
            return [line01, line12, line20];
        }
        else if (k === Simplex.LINE) {
            var point0 = new Simplex(k - 1);
            point0.vertices[0].attributes = simplex.vertices[0].attributes;

            var point1 = new Simplex(k - 1);
            point1.vertices[0].attributes = simplex.vertices[1].attributes;
            return [point0, point1];
        }
        else if (k === Simplex.POINT) {
            // For consistency, we get one empty simplex rather than an empty list.
            return [new Simplex(k - 1)];
        }
        else if (k === Simplex.EMPTY) {
            return [];
        }
        else {
            // TODO: Handle the TETRAHEDRON and general cases.
            throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
        }
    }
    private static subdivideMap(simplex: Simplex): Simplex[] {
        let divs: Simplex[] = [];
        let vertices = simplex.vertices;
        let k = simplex.k;
        if (k === Simplex.TRIANGLE) {
            let a = vertices[0].attributes;
            let b = vertices[1].attributes;
            let c = vertices[2].attributes;

            let m1 = lerpVertexAttributeMap(a, b, 0.5);
            let m2 = lerpVertexAttributeMap(b, c, 0.5);
            let m3 = lerpVertexAttributeMap(c, a, 0.5);

            let face1 = new Simplex(k);
            face1.vertices[0].attributes = c;
            face1.vertices[1].attributes = m3;
            face1.vertices[2].attributes = m2;
            let face2 = new Simplex(k);
            face2.vertices[0].attributes = a;
            face2.vertices[1].attributes = m1;
            face2.vertices[2].attributes = m3;
            let face3 = new Simplex(k);
            face3.vertices[0].attributes = b;
            face3.vertices[1].attributes = m2;
            face3.vertices[2].attributes = m1;
            let face4 = new Simplex(k);
            face4.vertices[0].attributes = m1;
            face4.vertices[1].attributes = m2;
            face4.vertices[2].attributes = m3;

            divs.push(face1);
            divs.push(face2);
            divs.push(face3);
            divs.push(face4);
        }
        else if (k === Simplex.LINE) {
            let a = vertices[0].attributes;
            let b = vertices[1].attributes;

            let m = lerpVertexAttributeMap(a, b, 0.5);

            let line1 = new Simplex(k);
            line1.vertices[0].attributes = a;
            line1.vertices[1].attributes = m;
            let line2 = new Simplex(k);
            line2.vertices[0].attributes = m;
            line2.vertices[1].attributes = b;

            divs.push(line1);
            divs.push(line2);
        }
        else if (k === Simplex.POINT) {
            divs.push(simplex);
        }
        else if (k === Simplex.EMPTY) {
            // Ignore, don't push is the generalization.
        }
        else {
            throw new Error(k + "-simplex is not supported");
        }

        return divs;
    }
    public static boundary(simplices: Simplex[], count = 1): Simplex[] {
        checkCountArg(count);
        for (var i = 0; i < count; i++) {
            simplices = simplices.map(Simplex.boundaryMap).reduce(concatReduce, []);
        }
        return simplices;
    }
    public static subdivide(simplices: Simplex[], count = 1): Simplex[] {
        checkCountArg(count);
        for (var i = 0; i < count; i++) {
            simplices = simplices.map(Simplex.subdivideMap).reduce(concatReduce, []);
        }
        return simplices;
    }

    /**
     * Copies the attributes onto all vertices of the simplex.
     */
    public static setAttributeValues(attributes: { [name: string]: VectorN<number>[] }, simplex: Simplex) {
        const names: string[] = Object.keys(attributes);
        const attribsLength = names.length;
        for (let attribIndex = 0; attribIndex < attribsLength; attribIndex++) {
            const name = names[attribIndex];
            const values: VectorN<number>[] = attributes[name];
            const valuesLength = values.length;
            for (let valueIndex = 0; valueIndex < valuesLength; valueIndex++) {
                simplex.vertices[valueIndex].attributes[name] = values[valueIndex];
            }
        }
    }
}
