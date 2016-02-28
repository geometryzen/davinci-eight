import ArrowGeometry from '../geometries/ArrowGeometry'
import BoxGeometry from '../geometries/BoxGeometry'
import BoxGeometryOptions from '../geometries/BoxGeometryOptions'
import BoxOptions from './BoxOptions'
import CylinderGeometry from '../geometries/CylinderGeometry'
import Geometry from '../core/Geometry'
import Material from '../core/Material'
import MeshMaterial from '../materials/MeshMaterial'
import SphereGeometry from '../geometries/SphereGeometry'
import SphereOptions from './SphereOptions'
import SpinorE3 from '../math/SpinorE3'
import TetrahedronGeometry from '../geometries/TetrahedronGeometry'
import TetrahedronOptions from './TetrahedronOptions'
import VectorE3 from '../math/VectorE3'

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
        return new ArrowGeometry()
    }
    box(stress: VectorE3, tilt: SpinorE3, offset: VectorE3, boxOptions: BoxOptions): Geometry {
        const geoOptions: BoxGeometryOptions = {}

        // Ignore the width, height, and depth in creating the Geometry.
        // Instead, create a unit cube and achieve the correct size through scaling.
        // geoOptions.width = boxOptions.width
        // geoOptions.height = boxOptions.height
        // geoOptions.depth = boxOptions.depth

        geoOptions.offset = boxOptions.offset

        return new BoxGeometry(geoOptions)
    }
    cylinder(stress: VectorE3, tilt: SpinorE3, offset: VectorE3): Geometry {
        return new CylinderGeometry()
    }
    sphere(options: SphereOptions): Geometry {
        return new SphereGeometry()
    }
    tetrahedron(options: TetrahedronOptions): Geometry {
        return new TetrahedronGeometry()
    }
    material(): Material {
        return new MeshMaterial()
    }
}

const visualCache = new VisualCache();

export default visualCache;
