import { Transform } from '../atoms/Transform';
import { Vertex } from '../atoms/Vertex';
import { mustBeObject } from '../checks/mustBeObject';
import { Spinor3 } from '../math/Spinor3';
import { SpinorE3 } from '../math/SpinorE3';
import { Vector3 } from '../math/Vector3';

/**
 * @hidden
 */
export class Rotation implements Transform {
    private R: Spinor3;
    private names: string[];

    constructor(R: SpinorE3, names: string[]) {
        this.R = Spinor3.copy(mustBeObject('R', R));
        this.names = names;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        const nLength = this.names.length;
        for (let k = 0; k < nLength; k++) {
            const aName = this.names[k];
            const v = vertex.attributes[aName];
            if (v.length === 3) {
                const vector = Vector3.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2));
                vector.rotate(this.R);
                vertex.attributes[aName] = vector;
            }
            else if (v.length === 4) {
                const spinor = Spinor3.spinor(v.getComponent(0), v.getComponent(1), v.getComponent(2), v.getComponent(3));
                spinor.rotate(this.R);
                vertex.attributes[aName] = spinor;
            }
            else {
                throw new Error(`Expecting ${aName} to be a vector with 3 coordinates`);
            }
        }
    }
}
