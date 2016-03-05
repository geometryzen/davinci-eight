import Facet from '../core/Facet'
import ContextProvider from '../core/ContextProvider'
import ShareableArray from '../collections/ShareableArray'
import ShareableContextConsumer from '../core/ShareableContextConsumer'
import AbstractDrawable from '../core/AbstractDrawable'

/**
 * A simple list of meshes that does not bypass the draw method of the AbstractDrawable.
 * This allows the AbstractDrawable to override the draw method to produce history and draw trails.
 */
export default class DrawList extends ShareableContextConsumer {
    private things: ShareableArray<AbstractDrawable>

    constructor() {
        super('DrawList')
        this.things = new ShareableArray<AbstractDrawable>()
    }

    protected destructor(): void {
        this.things.release()
        super.destructor()
    }

    add(drawable: AbstractDrawable): void {
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

    contextFree(context: ContextProvider): void {
        const iLen = this.things.length
        for (let i = 0; i < iLen; i++) {
            const mesh = this.things.getWeakRef(i)
            mesh.contextFree(context)
        }
        super.contextFree(context)
    }

    contextGain(context: ContextProvider): void {
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
