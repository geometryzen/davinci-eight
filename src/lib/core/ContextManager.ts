import { ContextConsumer } from "./ContextConsumer";
import { Shareable } from "./Shareable";

/**
 *
 */
export interface ContextManager extends Shareable {
    /**
     *
     */
    readonly gl: WebGL2RenderingContext | WebGLRenderingContext;
    /**
     * The context identifier that was used to get the WebGL rendering context.
     */
    readonly contextId: "webgl2" | "webgl";
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
}
