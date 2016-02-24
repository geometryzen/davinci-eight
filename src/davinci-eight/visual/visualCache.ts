import ArrowGeometry from '../geometries/ArrowGeometry';
import BoxGeometry from '../geometries/BoxGeometry';
import CylinderGeometry from '../geometries/CylinderGeometry';
import Geometry from '../core/Geometry';
import Material from '../core/Material';
import MeshMaterial from '../materials/MeshMaterial';
import SphereGeometry from '../geometries/SphereGeometry';
import TetrahedronGeometry from '../geometries/TetrahedronGeometry';
import VectorE3 from '../math/VectorE3';
import R3 from '../math/R3';

function arrow(axis: VectorE3): Geometry {
    return new ArrowGeometry(axis)
}

function box(axis: VectorE3): Geometry {
    return new BoxGeometry({ width: 1, height: 1, depth: 1 })
}

function cylinder(axis: VectorE3): Geometry {
    return new CylinderGeometry(axis);
}

function sphere(axis: VectorE3): Geometry {
    return new SphereGeometry()
}

function tetrahedron(axis: VectorE3): Geometry {
    return new TetrahedronGeometry();
}

function material(): Material {
    return new MeshMaterial()
}

function geometryKey(kind: string): string {
    const copy = {}
    return `${kind}${JSON.stringify(copy)}`
}

function materialKey(): string {
    // Make a copy so that:
    // 1. We can safely stringify,
    // 2. Filter only options that affect material caching,
    // 3. Make choices explicit for debugging.
    const copy = {}
    return `material${JSON.stringify(copy)}`
}

class VisualCache {
    // Intentionally use only weak references.
    // This class will be exposed as a Singleton so it won't be dropped.
    // Detect when instances are no longer in use using the isZombie method.
    private geometryMap: { [key: string]: Geometry } = {}
    private materialMap: { [key: string]: Material } = {}

    constructor() {
        // Do nothing yet.
    }
    private isZombieGeometryOrMissing(key: string): boolean {
        const geometry = this.geometryMap[key];
        if (geometry) {
            return geometry.isZombie();
        }
        else {
            return true;
        }
    }
    private isZombieMaterialOrMissing(key: string): boolean {
        const material = this.materialMap[key];
        if (material) {
            return material.isZombie();
        }
        else {
            return true;
        }
    }
    private ensureGeometry(key: string, factory: (axis: VectorE3) => Geometry, axis: VectorE3): Geometry {
        if (this.isZombieGeometryOrMissing(key)) {
            this.geometryMap[key] = factory(axis);
        }
        else {
            this.geometryMap[key].addRef();
        }
        return this.geometryMap[key];
    }
    private ensureMaterial(key: string, factory: () => Material): Material {
        if (this.isZombieMaterialOrMissing(key)) {
            this.materialMap[key] = factory();
        }
        else {
            this.materialMap[key].addRef();
        }
        return this.materialMap[key];
    }
    arrow(axis: VectorE3): Geometry {
        return this.ensureGeometry('arrow', arrow, axis);
    }
    box(): Geometry {
        return this.ensureGeometry(geometryKey('box'), box, R3.e2);
    }
    cylinder(e: VectorE3): Geometry {
        return this.ensureGeometry('cylinder', cylinder, e);
    }
    sphere(): Geometry {
        return this.ensureGeometry('sphere', sphere, R3.e2);
    }
    tetrahedron(): Geometry {
        return this.ensureGeometry('tetrahedron', tetrahedron, R3.e2);
    }
    material(): Material {
        const key = materialKey()
        return this.ensureMaterial(key, material);
    }
}

const visualCache = new VisualCache();

export default visualCache;
