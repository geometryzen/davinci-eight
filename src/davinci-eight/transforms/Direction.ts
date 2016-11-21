import mustBeString from '../checks/mustBeString';
import { Geometric2 } from '../math/Geometric2';
import { Geometric3 } from '../math/Geometric3';
import Spinor2 from '../math/Spinor2';
import Spinor3 from '../math/Spinor3';
import { Vector2 } from '../math/Vector2';
import Vector3 from '../math/Vector3';
import Vertex from '../atoms/Vertex';
import Transform from '../atoms/Transform';

export default class Direction implements Transform {

    /**
     *
     */
    private sourceName: string;

    constructor(sourceName: string) {
        this.sourceName = mustBeString('sourceName', sourceName);
    }

    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        const v = vertex.attributes[this.sourceName];
        if (v) {
            if (v instanceof Vector3) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Spinor3) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Vector2) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Spinor2) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Geometric3) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Geometric2) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else {
                throw new Error(`Expecting ${this.sourceName} to be a Vector, Spinor, or Geometric`);
            }
        }
        else {
            throw new Error(`Vertex attribute ${this.sourceName} was not found`);
        }
    }
}
