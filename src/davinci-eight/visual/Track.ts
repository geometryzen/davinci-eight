import BeginMode from '../core/BeginMode';
import {Color} from '../core/Color';
import ContextManager from '../core/ContextManager';
import contextManagerFromOptions from './contextManagerFromOptions';
import ContextProvider from '../core/ContextProvider';
import DataType from '../core/DataType';
import {Geometry} from '../core/Geometry';
import {LineMaterial} from '../materials/LineMaterial';
import {Material} from '../core/Material';
import Matrix4 from '../math/Matrix4';
import {Mesh} from '../core/Mesh';
import setColorOption from './setColorOption';
import Usage from '../core/Usage';
import VectorE3 from '../math/VectorE3';
import VertexBuffer from '../core/VertexBuffer';
import VisualOptions from './VisualOptions';

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
    private contextProvider: ContextProvider;
    constructor(private contextManager: ContextManager) {
        this.data = new Float32Array(this.N * FLOATS_PER_VERTEX);
        this.vbo = new VertexBuffer(contextManager);
    }
    bind(material: Material): TrackGeometry {
        if (this.dirty) {
            this.vbo.bufferData(this.data, Usage.DYNAMIC_DRAW);
            this.dirty = false;
        }
        this.vbo.bind();
        const aPosition = material.getAttrib('aPosition');
        aPosition.config(FLOATS_PER_VERTEX, DataType.FLOAT, true, STRIDE, 0);
        aPosition.enable();
        return this;
    }
    unbind(material: Material): TrackGeometry {
        const aPosition = material.getAttrib('aPosition');
        aPosition.disable();
        this.vbo.unbind();
        return this;
    }
    draw(material: Material): TrackGeometry {
        this.contextProvider.drawArrays(BeginMode.LINE_STRIP, 0, this.count);
        return this;
    }
    getPrincipalScale(name: string): number {
        throw new Error("LineGeometry.getPrincipalScale");
    }
    hasPrincipalScale(name: string): boolean {
        throw new Error("LineGeometry.hasPrincipalScale");
    }
    setPrincipalScale(name: string, value: number): void {
        throw new Error("LineGeometry.setPrincipalScale");
    }
    contextFree(contextProvider: ContextProvider): void {
        this.vbo.contextFree(contextProvider);
    }
    contextGain(contextProvider: ContextProvider): void {
        this.contextProvider = contextProvider;
        this.vbo.contextGain(contextProvider);
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
            // Clean Up
        }
        return this.refCount;
    }
    addPoint(x: number, y: number, z: number): void {
        if (this.count === this.N) {
            this.N = this.N * 2;
            const temp = new Float32Array(this.N * FLOATS_PER_VERTEX);
            temp.set(this.data);
            this.data = temp;
        }
        const offset = this.count * FLOATS_PER_VERTEX;
        this.data[offset + 0] = x;
        this.data[offset + 1] = y;
        this.data[offset + 2] = z;
        this.count++;
        this.dirty = true;
    }
    erase(): void {
        this.count = 0;
    }
}

interface TrackOptions extends VisualOptions {

}

export class Track extends Mesh<TrackGeometry, LineMaterial> {
    constructor(options: TrackOptions = {}, levelUp = 0) {
        super(new TrackGeometry(contextManagerFromOptions(options)), new LineMaterial(void 0, contextManagerFromOptions(options)), contextManagerFromOptions(options), levelUp + 1);
        this.setLoggingName('Track');
        setColorOption(this, options, Color.white);
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
    addPoint(point: VectorE3): void {
        if (point) {
            const geometry = <TrackGeometry>this.geometry;
            geometry.addPoint(point.x, point.y, point.z);
            geometry.release();
        }
    }
    clear(): void {
        const geometry = <TrackGeometry>this.geometry;
        geometry.erase();
        geometry.release();
    }
}
