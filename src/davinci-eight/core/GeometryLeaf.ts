import {Material} from './Material'
import BeginMode from './BeginMode'
import ContextProvider from './ContextProvider'
import config from '../config'
import {Engine} from './Engine'
import ErrorMode from './ErrorMode'
import {Geometry} from './Geometry'
import GeometryBase from './GeometryBase'
import isNumber from '../checks/isNumber'
import Matrix4 from '../math/Matrix4'
import mustBeNumber from '../checks/mustBeNumber'
import notImplemented from '../i18n/notImplemented'
import notSupported from '../i18n/notSupported'
import readOnly from '../i18n/readOnly'
import SpinorE3 from '../math/SpinorE3'
import VertexAttribPointer from './VertexAttribPointer'

/**
 *
 */
export default class GeometryLeaf extends GeometryBase {

    /**
     *
     */
    public mode: BeginMode;

    /**
     * <p>
     * The number of <em>bytes</em> for each element.
     * </p>
     * <p>
     * This is used in the vertexAttribPointer method.
     * Normally, we will use gl.FLOAT for each number which takes 4 bytes.
     * </p>
     */
    protected _stride: number;
    protected _pointers: VertexAttribPointer[];

    public scaling = Matrix4.one();

    constructor(tilt: SpinorE3, engine: Engine, levelUp: number) {
        super(tilt, engine, levelUp + 1);
        mustBeNumber('levelUp', levelUp);
        this.setLoggingName('GeometryLeaf')
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }

    /**
     * @method isLeaf
     * @return {boolean}
     */
    public isLeaf(): boolean {
        return true
    }

    /**
     * @property partsLength
     * @type number
     * @readOnly
     */
    get partsLength(): number {
        return 0
    }
    set partsLength(unused) {
        throw new Error(readOnly('partsLength').message)
    }

    /**
     * @method addPart
     * @param geometry {Geometry}
     * @return {void}
     */
    addPart(geometry: Geometry): void {
        throw new Error(notSupported('addPart').message)
    }

    /**
     * @method contextGain
     * @param contextProvider {ContextProvider}
     * @return {void}
     */
    public contextGain(contextProvider: ContextProvider): void {
        super.contextGain(contextProvider)
        if (!isNumber(this._stride)) {
            switch (config.errorMode) {
                case ErrorMode.WARNME: {
                    console.warn(`${this._type}.stride must be a number.`)
                }
                default: {
                    // Do nothing.
                }
            }
        }
    }

    /**
     * @method removePart
     * @param index {number}
     * @return {void}
     */
    removePart(index: number): void {
        throw new Error(notSupported('removePart').message)
    }

    /**
     * @method getPart
     * @param index {number}
     * @return {Geometry}
     */
    getPart(index: number): Geometry {
        throw new Error(notSupported('getPart').message)
    }

    bind(material: Material): void {
        throw new Error(notSupported('bind').message)
    }

    unbind(material: Material): void {
        throw new Error(notSupported('unbind').message)
    }

    draw(material: Material): void {
        throw new Error(notSupported('draw').message)
    }

    /**
     * @method hasPrincipalScale
     * @param name {string}
     * @return {boolean}
     */
    hasPrincipalScale(name: string): boolean {
        throw new Error(notImplemented(`hasPrincipalScale(${name})`).message)
    }

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
    public getPrincipalScale(name: string): number {
        throw new Error(notImplemented('getPrincipalScale').message)
    }

    /**
     * @method setPrincipalScale
     * @param name {string}
     * @param value {number}
     * @return {void}
     */
    public setPrincipalScale(name: string, value: number): void {
        throw new Error(notImplemented('setPrincipalScale').message)
    }
}
