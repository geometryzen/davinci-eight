import BeginMode from '../core/BeginMode';
import Color from '../core/Color';
import ContextManager from '../core/ContextManager';
import DataType from '../core/DataType';
import Geometry from '../core/Geometry';
import GPS from '../core/GraphicsProgramSymbols';
import LineMaterial from '../materials/LineMaterial';
import Material from '../core/Material';
import Matrix4 from '../math/Matrix4';
import Mesh from '../core/Mesh';
import setColorOption from './setColorOption';
import Usage from '../core/Usage';
import VectorE3 from '../math/VectorE3';
import VertexBuffer from '../core/VertexBuffer';

const FLOATS_PER_VERTEX = 3;
const BYTES_PER_FLOAT = 4;
const STRIDE = BYTES_PER_FLOAT * FLOATS_PER_VERTEX;

/**
 * 
 */
class TrackGeometry implements Geometry {
    scaling = Matrix4.one();
    private data: Float32Array;
    private count = 0;
    private N = 2;
    private dirty = true;
    private vbo: VertexBuffer;
    private refCount = 1;
    constructor(private contextManager: ContextManager) {
        this.data = new Float32Array(this.N * FLOATS_PER_VERTEX);
        this.vbo = new VertexBuffer(contextManager, this.data, Usage.DYNAMIC_DRAW);
    }
    protected destructor(): void {
        this.vbo.release();
        this.vbo = void 0;
    }
    bind(material: Material): TrackGeometry {
        if (this.dirty) {
            this.vbo.bind();
            this.vbo.upload();
            this.vbo.unbind();
            this.dirty = false;
        }
        this.vbo.bind();
        const aPosition = material.getAttrib(GPS.ATTRIBUTE_POSITION);
        aPosition.config(FLOATS_PER_VERTEX, DataType.FLOAT, true, STRIDE, 0);
        aPosition.enable();
        return this;
    }
    unbind(material: Material): TrackGeometry {
        const aPosition = material.getAttrib(GPS.ATTRIBUTE_POSITION);
        aPosition.disable();
        this.vbo.unbind();
        return this;
    }
    draw(): TrackGeometry {
        this.contextManager.gl.drawArrays(BeginMode.LINE_STRIP, 0, this.count);
        return this;
    }
    getScalingForAxis(): number {
        return 2;
    }
    contextFree(): void {
        this.vbo.contextFree();
    }
    contextGain(): void {
        this.vbo.contextGain();
    }
    contextLost(): void {
        this.vbo.contextLost();
    }
    addRef(): number {
        this.refCount++;
        return this.refCount;
    }
    release(): number {
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        return this.refCount;
    }

    /**
     * 
     */
    addPoint(x: number, y: number, z: number): void {
        if (this.count === this.N) {
            this.N = this.N * 2;
            const temp = new Float32Array(this.N * FLOATS_PER_VERTEX);
            temp.set(this.data);
            this.data = temp;
            this.vbo.release();
            this.vbo = new VertexBuffer(this.contextManager, this.data, Usage.DYNAMIC_DRAW);
        }
        const offset = this.count * FLOATS_PER_VERTEX;
        this.data[offset + 0] = x;
        this.data[offset + 1] = y;
        this.data[offset + 2] = z;
        this.count++;
        this.dirty = true;
    }

    /**
     * 
     */
    erase(): void {
        this.count = 0;
    }
}

interface TrackOptions {
    color?: { r: 0; g: 0; b: 0 };
}

/**
 * 
 */
export class Track extends Mesh<TrackGeometry, LineMaterial> {
    constructor(contextManager: ContextManager, options: TrackOptions = {}, levelUp = 0) {
        // The TrackGeometry cannot be cached because it is dynamic.
        // The LineMaterial can be cached.
        super(new TrackGeometry(contextManager), new LineMaterial(contextManager), contextManager, {}, levelUp + 1);
        this.setLoggingName('Track');
        // Adjust geometry reference count resulting from construction.
        const geometry = this.geometry;
        geometry.release();
        geometry.release();
        // Adjust material reference count resulting from construction.
        const material = this.material;
        material.release();
        material.release();

        setColorOption(this, options, Color.gray);

        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    /**
     * 
     */
    addPoint(point: VectorE3): void {
        if (point) {
            const geometry = this.geometry;
            geometry.addPoint(point.x, point.y, point.z);
            geometry.release();
        }
    }

    /**
     * 
     */
    clear(): void {
        const geometry = this.geometry;
        geometry.erase();
        geometry.release();
    }
}
