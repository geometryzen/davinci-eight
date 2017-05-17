import { Facet } from '../core/Facet';
import { ContextManager } from '../core/ContextManager';
import { Renderable } from '../core/Renderable';
import { ShareableArray } from '../collections/ShareableArray';
import { ShareableContextConsumer } from '../core/ShareableContextConsumer';
/**
 * A collection of Renderable objects.
 */
export declare class Scene extends ShareableContextConsumer implements Renderable {
    private _drawables;
    constructor(contextManager: ContextManager, levelUp?: number);
    protected destructor(levelUp: number): void;
    add(drawable: Renderable): void;
    contains(drawable: Renderable): boolean;
    /**
     * @deprecated. Use the render method instead.
     */
    draw(ambients: Facet[]): void;
    /**
     * Traverses the collection of Renderable objects, calling render(ambients) on each one.
     * The rendering takes place in two stages.
     * In the first stage, non-transparent objects are drawn.
     * In the second state, transparent objects are drawn.
     */
    render(ambients: Facet[]): void;
    find(match: (drawable: Renderable) => boolean): ShareableArray<Renderable>;
    findOne(match: (drawable: Renderable) => boolean): Renderable;
    findOneByName(name: string): Renderable;
    findByName(name: string): ShareableArray<Renderable>;
    remove(drawable: Renderable): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
}
