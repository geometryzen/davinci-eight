import { Facet } from '../core/Facet';
import { ContextConsumer } from '../core/ContextConsumer';

/**
 * The interface contract for an object that may exist in a Scene.
 * This interface is designed to place very few demands on the implementation.
 */
export interface Renderable extends ContextConsumer {
    /**
     * An optional name allowing the object to be found by name.
     */
    name?: string;

    /**
     * Determines when this object will be renderered relative to other objects.
     * Transparent objects are rendered after non-transparent objects.
     */
    transparent?: boolean;

    /**
     * Renders this object to the WebGL pipeline.
     */
    render(ambients: Facet[]): void;
}
