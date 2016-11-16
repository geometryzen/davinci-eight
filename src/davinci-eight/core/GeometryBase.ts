import BeginMode from './BeginMode';
import EventEmitter from '../utils/EventEmitter';
import ContextManager from './ContextManager';
import { Material } from './Material';
import { Geometry } from './Geometry';
import Matrix4 from '../math/Matrix4';
import mustBeObject from '../checks/mustBeObject';
import notImplemented from '../i18n/notImplemented';
import notSupported from '../i18n/notSupported';
import { ShareableContextConsumer } from './ShareableContextConsumer';
import Spinor3 from '../math/Spinor3';
import SpinorE3 from '../math/SpinorE3';
import VertexAttribPointer from './VertexAttribPointer';

/**
 * GeometryBase
 */
export default class GeometryBase extends ShareableContextConsumer implements Geometry {

    /**
     * Lazily instantiated EventEmitter.
     */
    private _eventBus: EventEmitter<Geometry, any>;

    /**
     *
     */
    protected _mode: BeginMode;

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

    /**
     * 
     */
    protected _pointers: VertexAttribPointer[];

    /**
     * Defaults to diag(1, 1, 1, 1)
     */
    public scaling = Matrix4.one();

    /**
     * Scratch variable for intermediate calculation value.
     * This can probably be raised to a module level constant.
     */
    private canonicalScale = Matrix4.one();

    /**
     * The rotation matrix equivalent to the initial tilt spinor.
     */
    private K = Matrix4.one();

    /**
     * The (cached) inverse of K.
     */
    private Kinv = Matrix4.one();

    /**
     * Cached value that tells you whether the K matrix is unity.
     */
    private Kidentity = true;

    constructor(tilt: SpinorE3, contextManager: ContextManager, levelUp: number) {
        super(contextManager);
        mustBeObject('contextManager', contextManager);
        this.setLoggingName("GeometryBase");
        if (tilt && !Spinor3.isOne(tilt)) {
            this.Kidentity = false;
            this.K.rotation(tilt);
            this.Kinv.copy(this.K).inv();
        }
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

    private ensureBus(): EventEmitter<Geometry, number> {
        if (!this._eventBus) {
            this._eventBus = new EventEmitter<Geometry, number>(this);
        }
        return this._eventBus;
    }

    on(eventName: string, callback: (eventName: string, key: string, value: any, source: Geometry) => void) {
        this.ensureBus().addEventListener(eventName, callback);
    }

    off(eventName: string, callback: (eventName: string, key: string, value: any, source: Geometry) => void) {
        this.ensureBus().removeEventListener(eventName, callback);
    }

    bind(material: Material): GeometryBase {
        throw new Error(notSupported('bind(material: Material)').message);
    }

    unbind(material: Material): GeometryBase {
        throw new Error(notSupported('unbind(material: Material)').message);
    }

    draw(): GeometryBase {
        throw new Error(notSupported('draw()').message);
    }

    hasPrincipalScale(name: string): boolean {
        throw new Error(notImplemented(`hasPrincipalScale(${name})`).message);
    }

    public getPrincipalScale(name: string): number {
        throw new Error(notImplemented('getPrincipalScale').message);
    }

    public setPrincipalScale(name: string, value: number): void {
        throw new Error(notImplemented('setPrincipalScale').message);
    }

    private getScale(i: number, j: number): number {
        if (this.Kidentity) {
            const sMatrix = this.scaling;
            return sMatrix.getElement(i, j);
        }
        else {
            const sMatrix = this.scaling;
            const cMatrix = this.canonicalScale;
            cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
            return cMatrix.getElement(i, j);
        }
    }

    protected getScaleX(): number {
        return this.getScale(0, 0);
    }

    protected getScaleY(): number {
        return this.getScale(1, 1);
    }

    protected getScaleZ(): number {
        return this.getScale(2, 2);
    }

    /**
     * Implementations of setPrincipalScale are expected to call this method.
     */
    protected setScale(x: number, y: number, z: number): void {
        if (this.Kidentity) {
            const sMatrix = this.scaling;
            const oldX = sMatrix.getElement(0, 0);
            const oldY = sMatrix.getElement(1, 1);
            const oldZ = sMatrix.getElement(2, 2);
            if (x !== oldX) {
                sMatrix.setElement(0, 0, x);
                if (this._eventBus) {
                    this._eventBus.emit('change', 'scaling', sMatrix);
                }
            }
            if (y !== oldY) {
                sMatrix.setElement(1, 1, y);
                if (this._eventBus) {
                    this._eventBus.emit('change', 'scaling', sMatrix);
                }
            }
            if (z !== oldZ) {
                sMatrix.setElement(2, 2, z);
                if (this._eventBus) {
                    this._eventBus.emit('change', 'scaling', sMatrix);
                }
            }
        }
        else {
            const sMatrix = this.scaling;
            const cMatrix = this.canonicalScale;
            cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
            const oldX = cMatrix.getElement(0, 0);
            const oldY = cMatrix.getElement(1, 1);
            const oldZ = cMatrix.getElement(2, 2);
            let matrixChanged = false;
            if (x !== oldX) {
                cMatrix.setElement(0, 0, x);
                matrixChanged = true;
            }
            if (y !== oldY) {
                cMatrix.setElement(1, 1, y);
                matrixChanged = true;
            }
            if (z !== oldZ) {
                cMatrix.setElement(2, 2, z);
                matrixChanged = true;
            }
            if (matrixChanged) {
                sMatrix.copy(this.K).mul(cMatrix).mul(this.Kinv);
                if (this._eventBus) {
                    this._eventBus.emit('change', 'scaling', sMatrix);
                }
            }
        }
    }
}
