import ArrowGeometry from '../geometries/ArrowGeometry';
import CuboidGeometry from '../geometries/CuboidGeometry';
import CylinderGeometry from '../geometries/CylinderGeometry';
import Geometry from '../core/Geometry';
import Material from '../core/Material';
import MeshMaterial from '../materials/MeshMaterial';
import SphereGeometry from '../geometries/SphereGeometry';
import TetrahedronGeometry from '../geometries/TetrahedronGeometry';

function arrow() {
    return new ArrowGeometry()
}

function cuboid() {
  return new CuboidGeometry(1, 1, 1)
}

function cylinder() {
    return new CylinderGeometry();
}

function sphere() {
    return new SphereGeometry()
}

function tetrahedron() {
    return  new TetrahedronGeometry();
}

class VisualCache {
    // Intentionally use only weak references.
    // This class will be exposed as a Singleton so it won't be dropped.
    // Detect when instances are no longer in use using the isZombie method.
    private buffersMap: { [key: string]: Geometry } = {}
    private _program: MeshMaterial;

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
    tetrahedron(): Geometry {
        return this.ensureBuffers('tetrahedron', tetrahedron);
    }
    program(): Material {
        if (this._program) {
            if (this._program.isZombie()) {
                this._program = new MeshMaterial();
            }
            else {
                this._program.addRef();
            }
        }
        else {
            this._program = new MeshMaterial();
        }
        return this._program;
    }
}

const visualCache = new VisualCache();

export default visualCache;
