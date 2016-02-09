import ArrowPrimitivesBuilder from '../geometries/ArrowPrimitivesBuilder';
import CuboidPrimitivesBuilder from '../geometries/CuboidPrimitivesBuilder';
import CylinderSimplexGeometry from '../geometries/CylinderSimplexGeometry';
import Geometry from '../core/Geometry';
import Material from '../core/Material';
import MeshMaterial from '../materials/MeshMaterial';
import G3 from '../math/G3';
import SphereGeometry from '../geometries/SphereGeometry';
import TetrahedronGeometry from '../geometries/TetrahedronGeometry';

function arrow() {
    const geometry = new ArrowPrimitivesBuilder(G3.e2);
    const primitives = geometry.toPrimitives();
    return new Geometry(primitives);
}

function cuboid() {
    const geometry = new CuboidPrimitivesBuilder();
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
