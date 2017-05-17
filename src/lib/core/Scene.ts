import { Facet } from '../core/Facet';
import { ContextManager } from '../core/ContextManager';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { Renderable } from '../core/Renderable';
import { ShareableArray } from '../collections/ShareableArray';
import { ShareableContextConsumer } from '../core/ShareableContextConsumer';

/**
 * A collection of Renderable objects.
 */
export class Scene extends ShareableContextConsumer implements Renderable {

    private _drawables: ShareableArray<Renderable>;

    constructor(contextManager: ContextManager, levelUp = 0) {
        super(contextManager);
        this.setLoggingName('Scene');
        mustBeNonNullObject('contextManager', contextManager);
        this._drawables = new ShareableArray<Renderable>([]);
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this._drawables.release();
        this._drawables = void 0;
        super.destructor(levelUp + 1);
    }

    add(drawable: Renderable): void {
        mustBeNonNullObject('drawable', drawable);
        this._drawables.push(drawable);
    }

    contains(drawable: Renderable): boolean {
        mustBeNonNullObject('drawable', drawable);
        return this._drawables.indexOf(drawable) >= 0;
    }

    /**
     * @deprecated. Use the render method instead.
     */
    draw(ambients: Facet[]): void {
        console.warn("Scene.draw is deprecated. Please use the Scene.render method instead.");
        this.render(ambients);
    }

    /**
     * Traverses the collection of Renderable objects, calling render(ambients) on each one.
     * The rendering takes place in two stages.
     * In the first stage, non-transparent objects are drawn.
     * In the second state, transparent objects are drawn.
     */
    render(ambients: Facet[]): void {
        const gl = this.gl;
        if (gl) {
            const ds = this._drawables;
            const iLen = ds.length;
            /**
             * true is non-transparent objects exist.
             */
            let passOne = false;
            /**
             * true if transparent objects exist.
             */
            let passTwo = false;
            // Zeroth pass through objects determines what kind of objects exist.
            for (let i = 0; i < iLen; i++) {
                const d = ds.getWeakRef(i);
                if (d.transparent) {
                    passTwo = true;
                }
                else {
                    passOne = true;
                }
            }
            if (passOne || passTwo) {
                if (passTwo) {
                    const previousMask: boolean = gl.getParameter(gl.DEPTH_WRITEMASK);
                    if (passOne) {
                        // Render non-transparent objects in the first pass.
                        gl.depthMask(true);
                        for (let i = 0; i < iLen; i++) {
                            const d = ds.getWeakRef(i);
                            if (!d.transparent) {
                                d.render(ambients);
                            }
                        }
                    }
                    // Render transparent objects in the second pass.
                    gl.depthMask(false);
                    for (let i = 0; i < iLen; i++) {
                        const d = ds.getWeakRef(i);
                        if (d.transparent) {
                            d.render(ambients);
                        }
                    }
                    gl.depthMask(previousMask);
                }
                else {
                    // There must be non-transparent objects, render them.
                    for (let i = 0; i < iLen; i++) {
                        const d = ds.getWeakRef(i);
                        if (!d.transparent) {
                            d.render(ambients);
                        }
                    }
                }
            }
        }
    }

    find(match: (drawable: Renderable) => boolean): ShareableArray<Renderable> {
        return this._drawables.find(match);
    }

    findOne(match: (drawable: Renderable) => boolean): Renderable {
        return this._drawables.findOne(match);
    }

    findOneByName(name: string): Renderable {
        return this.findOne(function (drawable) { return drawable.name === name; });
    }

    findByName(name: string): ShareableArray<Renderable> {
        return this.find(function (drawable) { return drawable.name === name; });
    }

    remove(drawable: Renderable): void {
        mustBeNonNullObject('drawable', drawable);
        const index = this._drawables.indexOf(drawable);
        if (index >= 0) {
            this._drawables.splice(index, 1).release();
        }
    }

    contextFree(): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i);
            if (drawable.contextFree) {
                drawable.contextFree();
            }
        }
        super.contextFree();
    }

    contextGain(): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i);
            if (drawable.contextGain) {
                drawable.contextGain();
            }
        }
        super.contextGain();
    }

    contextLost(): void {
        for (let i = 0; i < this._drawables.length; i++) {
            const drawable = this._drawables.getWeakRef(i);
            if (drawable.contextLost) {
                drawable.contextLost();
            }
        }
        super.contextLost();
    }
}
