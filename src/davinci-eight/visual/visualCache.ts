import ArrowGeometry from '../geometries/ArrowGeometry';
import CuboidGeometry from '../geometries/CuboidGeometry';
import CylinderSimplexGeometry from '../geometries/CylinderSimplexGeometry';
import Geometry from '../scene/Geometry';
import Material from '../core/Material';
import MeshLambertMaterial from '../materials/MeshLambertMaterial';
import G3 from '../math/G3';
import SphereGeometry from '../geometries/SphereGeometry';

function arrow() {
    const geometry = new ArrowGeometry(G3.e2);
    const primitives = geometry.toPrimitives();
    return new Geometry(primitives);
}

function cuboid() {
    const geometry = new CuboidGeometry();
    const primitives = geometry.toPrimitives();
    return new Geometry(primitives);
}

function cylinder() {
    const geometry = new CylinderSimplexGeometry();
    const primitives = geometry.toPrimitives();
    return new Geometry(primitives);
}

function sphere() {
    const geometry = new SphereGeometry(1, G3.e2);
    const primitives = geometry.toPrimitives();
    return new Geometry(primitives);
}

class VisualCache {
    // Intentionally use only weak references.
    private buffersMap: { [key: string]: Geometry } = {}
    private _program: MeshLambertMaterial;

    constructor() {
        // Do nothing yet.
    }
    private isZombieOrMissing(key: string): boolean {
        const buffers = this.buffersMap[key];
        if (buffers) {
            return buffers.isZombie();
        }
        else {
            return true;
        }
    }
    private ensureBuffers(key: string, factory: () => Geometry): Geometry {
        if (this.isZombieOrMissing(key)) {
            this.buffersMap[key] = factory();
        }
        else {
            this.buffersMap[key].addRef();
        }
        return this.buffersMap[key];
    }
    arrow(): Geometry {
        return this.ensureBuffers('arrow', arrow);
    }
    cuboid(): Geometry {
        return this.ensureBuffers('cuboid', cuboid);
    }
    cylinder(): Geometry {
        return this.ensureBuffers('cylinder', cylinder);
    }
    sphere(): Geometry {
        return this.ensureBuffers('sphere', sphere);
    }
    program(): Material {
        if (this._program) {
            if (this._program.isZombie()) {
                this._program = new MeshLambertMaterial();
            }
            else {
                this._program.addRef();
            }
        }
        else {
            this._program = new MeshLambertMaterial();
        }
        return this._program;
    }
}

const visualCache = new VisualCache();

export default visualCache;
