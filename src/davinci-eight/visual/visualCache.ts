import ArrowGeometry from '../geometries/ArrowGeometry';
import CuboidGeometry from '../geometries/CuboidGeometry';
import CylinderSimplexGeometry from '../geometries/CylinderSimplexGeometry';
import GraphicsBuffers from '../resources/GraphicsBuffers';
import IGraphicsBuffers from '../core/IGraphicsBuffers';
import IGraphicsProgram from '../core/IGraphicsProgram';
import MeshLambertMaterial from '../materials/MeshLambertMaterial';
import G3 from '../math/G3';
import SphereGeometry from '../geometries/SphereGeometry';

function arrow() {
    const geometry = new ArrowGeometry(G3.e2);
    const primitives = geometry.toPrimitives();
    return new GraphicsBuffers(primitives);
}

function box() {
    const geometry = new CuboidGeometry();
    const primitives = geometry.toPrimitives();
    return new GraphicsBuffers(primitives);
}

function cylinder() {
    const geometry = new CylinderSimplexGeometry();
    const primitives = geometry.toPrimitives();
    return new GraphicsBuffers(primitives);
}

function sphere() {
    const geometry = new SphereGeometry(1, G3.e2);
    const primitives = geometry.toPrimitives();
    return new GraphicsBuffers(primitives);
}

class VisualCache {
    // Intentionally use only weak references.
    private buffersMap: { [key: string]: GraphicsBuffers } = {}
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
    private ensureBuffers(key: string, factory: () => GraphicsBuffers): GraphicsBuffers {
        if (this.isZombieOrMissing(key)) {
            this.buffersMap[key] = factory();
        }
        else {
            this.buffersMap[key].addRef();
        }
        return this.buffersMap[key];
    }
    arrow(): IGraphicsBuffers {
        return this.ensureBuffers('arrow', arrow);
    }
    box(): IGraphicsBuffers {
        return this.ensureBuffers('box', box);
    }
    cylinder(): IGraphicsBuffers {
        return this.ensureBuffers('cylinder', cylinder);
    }
    sphere(): IGraphicsBuffers {
        return this.ensureBuffers('sphere', sphere);
    }
    program(): IGraphicsProgram {
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
