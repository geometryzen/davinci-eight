import {Engine} from './Engine'
import mustBeNumber from '../checks/mustBeNumber'
import mustBeObject from '../checks/mustBeObject'
import readOnly from '../i18n/readOnly'
import ShareableContextConsumer from './ShareableContextConsumer'
import VertexBuffer from './VertexBuffer'

export default class VertexBufferPackage extends ShareableContextConsumer {

    private _first: number
    private _vbo: VertexBuffer

    constructor(first: number, vbo: VertexBuffer, engine: Engine) {
        super(engine)
        this._first = mustBeNumber('first', first)
        mustBeObject('vbo', vbo)
        vbo.addRef()
        this._vbo = vbo
    }

    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1)
    }

    get first(): number {
        return this._first
    }
    set first(first: number) {
        throw new Error(readOnly('first').message)
    }
}
