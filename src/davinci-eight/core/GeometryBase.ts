import ContextManager from './ContextManager';
import {Material} from './Material';
import {Geometry} from './Geometry';
import Matrix4 from '../math/Matrix4';
import notImplemented from '../i18n/notImplemented';
import notSupported from '../i18n/notSupported';
import {ShareableContextConsumer} from './ShareableContextConsumer';
import Spinor3 from '../math/Spinor3';
import SpinorE3 from '../math/SpinorE3';

/**
 *
 */
export default class GeometryBase extends ShareableContextConsumer implements Geometry {
    /**
     * @default diag(1, 1, 1, 1)
     */
    public scaling = Matrix4.one()

    private canonicalScale = Matrix4.one();
    /**
     * The rotation matrix equivalent to the initial tilt.
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
        this.setLoggingName("GeometryBase");
        if (tilt && !Spinor3.isOne(tilt)) {
            this.Kidentity = false
            this.K.rotation(tilt)
            this.Kinv.copy(this.K).inv()
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

    bind(material: Material): GeometryBase {
        throw new Error(notSupported('bind').message)
    }

    unbind(material: Material): GeometryBase {
        throw new Error(notSupported('unbind').message)
    }

    draw(material: Material): GeometryBase {
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

    protected setScale(x: number, y: number, z: number): void {
        if (this.Kidentity) {
            this.scaling.setElement(0, 0, x)
            this.scaling.setElement(1, 1, y)
            this.scaling.setElement(2, 2, z)
        }
        else {
            this.canonicalScale.copy(this.Kinv).mul(this.scaling).mul(this.K)
            this.canonicalScale.setElement(0, 0, x)
            this.canonicalScale.setElement(1, 1, y)
            this.canonicalScale.setElement(2, 2, z)
            this.scaling.copy(this.K).mul(this.canonicalScale).mul(this.Kinv)
        }
    }

}
