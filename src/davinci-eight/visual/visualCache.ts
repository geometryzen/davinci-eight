import ArrowBuilder from '../geometries/ArrowBuilder';
import BoxGeometry from '../geometries/BoxGeometry';
import BoxOptions from './BoxOptions'
import CylinderGeometry from '../geometries/CylinderGeometry';
import Geometry from '../core/Geometry';
import Material from '../core/Material';
import MeshMaterial from '../materials/MeshMaterial';
import SphereGeometry from '../geometries/SphereGeometry';
import SphereOptions from './SphereOptions'
import SpinorE3 from '../math/SpinorE3';
import TetrahedronGeometry from '../geometries/TetrahedronGeometry';
import TetrahedronOptions from './TetrahedronOptions';
import VectorE3 from '../math/VectorE3';

class VisualCache {
    // Intentionally use only weak references.
    // This class will be exposed as a Singleton so it won't be dropped.
    // Detect when instances are no longer in use using the isZombie method.
    // private geometryMap: { [key: string]: Geometry } = {}
    // private materialMap: { [key: string]: Material } = {}

    constructor() {
        // Do nothing yet.
    }
    arrow(stress: VectorE3, tilt: SpinorE3, offset: VectorE3): Geometry {
        const builder = new ArrowBuilder()
        builder.stress.copy(stress)
        builder.tilt.copy(tilt)
        builder.offset.copy(offset)
        return builder.toGeometry()
    }
    box(options: BoxOptions): Geometry {
        // FIXME: Replace with Builder pattern.
        return new BoxGeometry({ width: 1, height: 1, depth: 1 })
    }
    cylinder(stress: VectorE3, tilt: SpinorE3, offset: VectorE3): Geometry {
        // FIXME: Replace with Builder pattern.
        return new CylinderGeometry(stress, tilt, offset);
    }
    sphere(options: SphereOptions): Geometry {
        // FIXME: Replace with Builder pattern.
        return new SphereGeometry()
    }
    tetrahedron(options: TetrahedronOptions): Geometry {
        // FIXME: Replace with Builder pattern.
        return new TetrahedronGeometry();
    }
    material(): Material {
        return new MeshMaterial()
    }
}

const visualCache = new VisualCache();

export default visualCache;
