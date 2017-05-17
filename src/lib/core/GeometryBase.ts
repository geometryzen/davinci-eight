import { ContextManager } from './ContextManager';
import { Geometry } from './Geometry';
import { Material } from './Material';
import { mustBeDefined } from '../checks/mustBeDefined';
import { notSupported } from '../i18n/notSupported';
import { ShareableContextConsumer } from './ShareableContextConsumer';

/**
 * GeometryBase
 */
export class GeometryBase extends ShareableContextConsumer implements Geometry {
    /**
     * 
     */
    constructor(contextManager: ContextManager, levelUp: number) {
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
    bind(material: Material): this {
        mustBeDefined('material', material);
        throw new Error(notSupported(`bind(material: Material)`).message);
    }
    /**
     * 
     */
    unbind(material: Material): this {
        mustBeDefined('material', material);
        throw new Error(notSupported(`unbind(material: Material)`).message);
    }
    /**
     * 
     */
    draw(): GeometryBase {
        throw new Error(notSupported('draw()').message);
    }
}
