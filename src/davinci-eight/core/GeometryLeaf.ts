import {Material} from './Material';
import BeginMode from './BeginMode';
import ContextManager from './ContextManager';
import {Geometry} from './Geometry';
import GeometryBase from './GeometryBase';
import Matrix4 from '../math/Matrix4';
import mustBeNumber from '../checks/mustBeNumber';
import notImplemented from '../i18n/notImplemented';
import notSupported from '../i18n/notSupported';
import readOnly from '../i18n/readOnly';
import SpinorE3 from '../math/SpinorE3';
import VertexAttribPointer from './VertexAttribPointer';

/**
 *
 */
export default class GeometryLeaf extends GeometryBase {

    /**
     *
     */
    public mode: BeginMode;

    /**
     * <p>
     * The number of <em>bytes</em> for each element.
     * </p>
     * <p>
     * This is used in the vertexAttribPointer method.
     * Normally, we will use gl.FLOAT for each number which takes 4 bytes.
     * </p>
     */
    protected _stride: number;
    protected _pointers: VertexAttribPointer[];

    public scaling = Matrix4.one();

    constructor(tilt: SpinorE3, contextManager: ContextManager, levelUp: number) {
        super(tilt, contextManager, levelUp + 1);
        mustBeNumber('levelUp', levelUp);
        this.setLoggingName('GeometryLeaf')
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

    public isLeaf(): boolean {
        return true
    }

    get partsLength(): number {
        return 0
    }
    set partsLength(unused) {
        throw new Error(readOnly('partsLength').message)
    }

    addPart(geometry: Geometry): void {
        throw new Error(notSupported('addPart').message)
    }

    removePart(index: number): void {
        throw new Error(notSupported('removePart').message)
    }

    getPart(index: number): Geometry {
        throw new Error(notSupported('getPart').message)
    }

    bind(material: Material): void {
        throw new Error(notSupported('bind').message)
    }

    unbind(material: Material): void {
        throw new Error(notSupported('unbind').message)
    }

    draw(material: Material): void {
        throw new Error(notSupported('draw').message)
    }

    hasPrincipalScale(name: string): boolean {
        throw new Error(notImplemented(`hasPrincipalScale(${name})`).message)
    }

    public getPrincipalScale(name: string): number {
        throw new Error(notImplemented('getPrincipalScale').message)
    }

    public setPrincipalScale(name: string, value: number): void {
        throw new Error(notImplemented('setPrincipalScale').message)
    }
}
