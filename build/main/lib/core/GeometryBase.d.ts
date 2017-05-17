import { ContextManager } from './ContextManager';
import { Geometry } from './Geometry';
import { Material } from './Material';
import { ShareableContextConsumer } from './ShareableContextConsumer';
/**
 * GeometryBase
 */
export declare class GeometryBase extends ShareableContextConsumer implements Geometry {
    /**
     *
     */
    constructor(contextManager: ContextManager, levelUp: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     *
     */
    bind(material: Material): this;
    /**
     *
     */
    unbind(material: Material): this;
    /**
     *
     */
    draw(): GeometryBase;
}
