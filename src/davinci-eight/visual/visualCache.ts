import ArrowGeometry from '../geometries/ArrowGeometry';
import CuboidGeometry from '../geometries/CuboidGeometry';
import CylinderGeometry from '../geometries/CylinderGeometry';
import Geometry from '../core/Geometry';
import Material from '../core/Material';
import LineMaterial from '../materials/LineMaterial';
import MeshMaterial from '../materials/MeshMaterial';
import SphereGeometry from '../geometries/SphereGeometry';
import TetrahedronGeometry from '../geometries/TetrahedronGeometry';
import VisualOptions from './VisualOptions';

function wireFrame(options: VisualOptions): boolean {
  if (options.wireFrame) {
    return true
  }
  else {
    return false
  }
}

function arrow(options: VisualOptions): Geometry {
    return new ArrowGeometry()
}

function cuboid(options: VisualOptions): Geometry {
  return new CuboidGeometry(1, 1, 1, wireFrame(options))
}

function cylinder(options: VisualOptions): Geometry {
    return new CylinderGeometry();
}

function sphere(options: VisualOptions): Geometry {
    return new SphereGeometry()
}

function tetrahedron(options: VisualOptions): Geometry {
    return  new TetrahedronGeometry();
}

function material(options: VisualOptions): Material {
  if (wireFrame(options)) {
    return new LineMaterial()
  }
  else {
    return new MeshMaterial()
  }
}

function geometryKey(kind: string, options: VisualOptions): string {
  const copy: VisualOptions = {}
  copy.wireFrame = wireFrame(options)
  return `${kind}${JSON.stringify(copy)}`
}

function materialKey(options: VisualOptions): string {
  // Make a copy so that:
  // 1. We can safely stringify,
  // 2. Filter only options that affect material caching,
  // 3. Make choices explicit for debugging.
  const copy: VisualOptions = {}
  copy.wireFrame = wireFrame(options)
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
    private ensureGeometry(key: string, factory: (options: VisualOptions) => Geometry, options: VisualOptions): Geometry {
        if (this.isZombieGeometryOrMissing(key)) {
            this.geometryMap[key] = factory(options);
        }
        else {
            this.geometryMap[key].addRef();
        }
        return this.geometryMap[key];
    }
    private ensureMaterial(key: string, factory: (options: VisualOptions) => Material, options: VisualOptions): Material {
        if (this.isZombieMaterialOrMissing(key)) {
            this.materialMap[key] = factory(options);
        }
        else {
            this.materialMap[key].addRef();
        }
        return this.materialMap[key];
    }
    arrow(options: VisualOptions): Geometry {
        return this.ensureGeometry('arrow', arrow ,options);
    }
    cuboid(options: VisualOptions): Geometry {
        return this.ensureGeometry(geometryKey('cuboid', options), cuboid ,options);
    }
    cylinder(options: VisualOptions): Geometry {
        return this.ensureGeometry('cylinder', cylinder ,options);
    }
    sphere(options: VisualOptions): Geometry {
        return this.ensureGeometry('sphere', sphere ,options);
    }
    tetrahedron(options: VisualOptions): Geometry {
        return this.ensureGeometry('tetrahedron', tetrahedron ,options);
    }
    material(options: VisualOptions): Material {
        const key = materialKey(options)
        return this.ensureMaterial(key, material ,options);
    }
}

const visualCache = new VisualCache();

export default visualCache;
