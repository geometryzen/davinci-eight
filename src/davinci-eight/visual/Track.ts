import BeginMode from '../core/BeginMode';
import ContextManager from '../core/ContextManager';
import ContextProvider from '../core/ContextProvider';
import DataType from '../core/DataType';
import {Geometry} from '../core/Geometry';
import {LineMaterial} from '../materials/LineMaterial';
import {Material} from '../core/Material';
import Matrix4 from '../math/Matrix4';
import {Mesh} from '../core/Mesh';
import Usage from '../core/Usage';
import VertexBuffer from '../core/VertexBuffer';

const FLOATS_PER_VERTEX = 3;
const BYTES_PER_FLOAT = 4;
const STRIDE = BYTES_PER_FLOAT * FLOATS_PER_VERTEX;
/**
 * 
 */
class LineGeometry implements Geometry {
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
    bind(material: Material): LineGeometry {
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
    unbind(material: Material): LineGeometry {
        const aPosition = material.getAttrib('aPosition');
        aPosition.disable();
        this.vbo.unbind()
        return this;
    }
    draw(material: Material): LineGeometry {
        // console.log(`LineGeometry.draw(${this.i})`)
        this.contextProvider.gl.drawArrays(BeginMode.LINE_STRIP, 0, this.count);
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
            temp.set(this.data)
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

export class Track extends Mesh {
    constructor(contextManager: ContextManager, private mesh: Mesh, levelUp = 0) {
        super(new LineGeometry(contextManager), new LineMaterial(void 0, contextManager), contextManager, levelUp + 1);
    }
    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1)
    }
    erase(): void {
        const geometry = <LineGeometry>this.geometry;
        geometry.erase();
        geometry.release();
    }
    snapshot(): void {
        const X = this.mesh.X;
        const geometry = <LineGeometry>this.geometry;
        geometry.addPoint(X.x, X.y, X.z);
        geometry.release();
    }
}
