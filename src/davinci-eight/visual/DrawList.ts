import Facet from '../core/Facet'
import IContextProvider from '../core/IContextProvider'
import ShareableArray from '../collections/ShareableArray'
import ShareableContextListener from '../core/ShareableContextListener'
import IDrawable from '../core/IDrawable'

/**
 * A simple list of meshes that does not bypass the draw method of the IDrawable.
 * This allows the IDrawable to override the draw method to produce history and draw trails.
 */
export default class DrawList extends ShareableContextListener {
    private things: ShareableArray<IDrawable>

    constructor() {
        super('DrawList')
        this.things = new ShareableArray<IDrawable>()
    }

    protected destructor(): void {
        this.things.release()
        super.destructor()
    }

    add(drawable: IDrawable): void {
        // Don't return the index because we don't want to guarantee the order.
        this.things.push(drawable)
    }

    draw(ambients: Facet[]) {
        const iLen = this.things.length
        for (let i = 0; i < iLen; i++) {
            const mesh = this.things.getWeakRef(i)
            mesh.draw(ambients)
        }
    }

    contextFree(context: IContextProvider): void {
        const iLen = this.things.length
        for (let i = 0; i < iLen; i++) {
            const mesh = this.things.getWeakRef(i)
            mesh.contextFree(context)
        }
        super.contextFree(context)
    }

    contextGain(context: IContextProvider): void {
        const iLen = this.things.length
        for (let i = 0; i < iLen; i++) {
            const mesh = this.things.getWeakRef(i)
            mesh.contextGain(context)
        }
        super.contextGain(context)
    }

    contextLost(): void {
        const iLen = this.things.length
        for (let i = 0; i < iLen; i++) {
            const mesh = this.things.getWeakRef(i)
            mesh.contextLost()
        }
        super.contextLost()
    }
}
