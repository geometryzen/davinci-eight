import ContextManager from './ContextManager';
import Material from './Material';
import Geometry from './Geometry';
import notSupported from '../i18n/notSupported';
import ShareableContextConsumer from './ShareableContextConsumer';
import SpinorE3 from '../math/SpinorE3';

/**
 * GeometryBase
 */
export default class GeometryBase extends ShareableContextConsumer implements Geometry {
    /**
     * 
     */
    constructor(private tilt: SpinorE3, contextManager: ContextManager, levelUp: number) {
        super(contextManager);
        this.setLoggingName("GeometryBase");
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName("GeometryBase");
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
    getScalingForAxis(): number {
        return 0;
    }
    /**
     * 
     */
    bind(material: Material): GeometryBase {
        throw new Error(notSupported('bind(material: Material)').message);
    }
    /**
     * 
     */
    unbind(material: Material): GeometryBase {
        throw new Error(notSupported('unbind(material: Material)').message);
    }
    /**
     * 
     */
    draw(): GeometryBase {
        throw new Error(notSupported('draw()').message);
    }
}
