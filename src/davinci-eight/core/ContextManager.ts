import ContextConsumer from './ContextConsumer';
import Shareable from './Shareable';
import Geometry from './Geometry';
import GeometryKey from './GeometryKey';
import Material from './Material';
import MaterialKey from './MaterialKey';

/**
 * 
 */
export interface ContextManager extends Shareable {
    /**
     * 
     */
    readonly gl: WebGLRenderingContext;
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
    getCacheGeometry<G extends Geometry>(key: GeometryKey<G>): G;
    /**
     * 
     */
    putCacheGeometry<G extends Geometry>(key: GeometryKey<G>, geometry: G): void;
    /**
     * 
     */
    getCacheMaterial<M extends Material>(key: MaterialKey<M>): M;
    /**
     * 
     */
    putCacheMaterial<M extends Material>(key: MaterialKey<M>, material: M): void;
}

export default ContextManager;
