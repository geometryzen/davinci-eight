import {Color} from '../core/Color';
import ContextProvider from '../core/ContextProvider';
import {Facet} from '../core/Facet';
import G3 from './G3';
import {Renderable} from '../core/Renderable';
import {scale} from './WorldG3';
import WorldG3 from './WorldG3';

export default class ArrowG3 implements Renderable {
    public name: string;
    public transparent = false;
    public h = G3.meter;
    public X = G3.meter;
    public color = Color.lime.clone();
    public scaleFactor = G3.meter;
    private refCount = 1;
    constructor(private world: WorldG3) {
        world.add(this)
    }
    addRef(): number {
        this.refCount++;
        return this.refCount;
    }
    release(): number {
        this.refCount--;
        return this.refCount;
    }
    contextFree(contextProvider: ContextProvider): void {
    }
    contextGain(contextProvider: ContextProvider): void {
    }
    contextLost(): void {
    }
    render(ambients: Facet[]): void {
        const arrow = this.world.arrow;
        arrow.X = scale(this.X, this.world.scaleFactor)
        arrow.h = scale(this.h, this.scaleFactor)
        arrow.color.copy(this.color);
        arrow.render(ambients);
    }
}