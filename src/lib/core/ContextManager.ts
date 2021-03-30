import { ContextConsumer } from './ContextConsumer';
import { Geometry } from './Geometry';
import { GeometryKey } from './GeometryKey';
import { Material } from './Material';
import { MaterialKey } from './MaterialKey';
import { Shareable } from './Shareable';

/**
 * @hidden
 */
export interface ContextManager extends Shareable {
    /**
     * 
     */
    readonly gl: WebGL2RenderingContext | WebGLRenderingContext;
    /**
     * The context identifier that was used to get the WebGL rendering context.
     */
    readonly contextId: 'webgl2' | 'webgl';
    /**
     * 
     */
    synchronize(consumer: ContextConsumer): void;
    /**
     * 
     */
    addContextListener(consumer: ContextConsumer): void;
    /**
     * 
     */
    removeContextListener(consumer: ContextConsumer): void;
    /**
     * 
     */
    getCacheGeometry<G extends Geometry>(key: GeometryKey): G;
    /**
     * 
     */
    putCacheGeometry<G extends Geometry>(key: GeometryKey, geometry: G): void;
    /**
     * 
     */
    getCacheMaterial<M extends Material>(key: MaterialKey): M;
    /**
     * 
     */
    putCacheMaterial<M extends Material>(key: MaterialKey, material: M): void;
}
