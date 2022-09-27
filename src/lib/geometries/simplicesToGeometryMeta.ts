import { VectorN } from '../atoms/VectorN';
import { Vertex } from '../atoms/Vertex';
import { expectArg } from '../checks/expectArg';
import { isDefined } from '../checks/isDefined';
import { AttributeSizeType } from '../core/AttributeSizeType';
import { dataLength } from './dataLength';
import { GeometryMeta } from './GeometryMeta';
import { Simplex } from './Simplex';

/**
 * @hidden
 */
function stringify(thing: any, space: any): string {
    const cache: any[] = [];
    return JSON.stringify(thing, function (key: string, value: any) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, space);
}

/**
 * Returns undefined (void 0) for an empty geometry.
 * @hidden
 */
export function simplicesToGeometryMeta(geometry: Simplex[]): GeometryMeta {
    let kValueOfSimplex: number = void 0;
    const knowns: { [key: string]: { size: AttributeSizeType } } = {};
    const geometryLen = geometry.length;
    for (let i = 0; i < geometryLen; i++) {
        const simplex: Simplex = geometry[i];
        if (!(simplex instanceof Simplex)) {
            expectArg('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ simplicesToGeometryMeta(). Found " + stringify(simplex, 2));
        }
        const vertices: Vertex[] = simplex.vertices;
        // TODO: Check consistency of k-values.
        kValueOfSimplex = simplex.k;
        for (let j = 0, vsLen = vertices.length; j < vsLen; j++) {
            const vertex: Vertex = vertices[j];
            const attributes = vertex.attributes;
            const keys: string[] = Object.keys(attributes);
            const keysLen = keys.length;
            for (let k = 0; k < keysLen; k++) {
                const key = keys[k];
                const value: VectorN<number> = attributes[key];
                const dLength = dataLength(value);
                const known = knowns[key];
                if (known) {
                    if (known.size !== dLength) {
                        throw new Error("Something is rotten in Denmark!");
                    }
                }
                else {
                    knowns[key] = { size: dLength };
                }
            }
        }
    }
    // isDefined is necessary because k = -1, 0, 1, 2, 3, ... are legal and 0 is falsey.
    if (isDefined(kValueOfSimplex)) {
        const info: GeometryMeta = {
            get attributes() {
                return knowns;
            },
            get k() {
                return kValueOfSimplex;
            }
        };
        return info;
    }
    else {
        return void 0;
    }
}
