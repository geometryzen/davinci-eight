import { Color } from '../core/Color';
import { ContextManager } from '../core/ContextManager';
import { Facet } from '../core/Facet';
import { Renderable } from '../core/Renderable';
import { Geometric3 } from '../math/Geometric3';
export declare class Parallelepiped implements Renderable {
    private levelUp;
    name: string;
    opacity: number;
    transparent: boolean;
    X: Geometric3;
    /**
     *
     */
    a: Geometric3;
    b: Geometric3;
    c: Geometric3;
    /**
     * Face colors
     * top    - 0
     * right  - 1
     * front  - 2
     * bottom - 3
     * left   - 4
     * back   - 5
     */
    colors: Color[];
    private contextManager;
    private refCount;
    private mesh;
    constructor(contextManager: ContextManager, levelUp?: number);
    protected destructor(levelUp: number): void;
    render(ambients: Facet[]): void;
    addRef(): number;
    release(): number;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
}
