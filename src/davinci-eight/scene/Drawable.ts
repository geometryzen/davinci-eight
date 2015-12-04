import simplicesToGeometryMeta = require('../geometries/simplicesToGeometryMeta')
import IContextProvider = require('../core/IContextProvider')
import IContextMonitor = require('../core/IContextMonitor')
import core = require('../core');
import GeometryMeta = require('../geometries/GeometryMeta')
import IDrawable = require('../core/IDrawable')
import IBufferGeometry = require('../geometries/IBufferGeometry')
import isDefined = require('../checks/isDefined')
import IGraphicsProgram = require('../core/IGraphicsProgram')
import IUnknownArray = require('../collections/IUnknownArray')
import GraphicsProgram = require('../materials/GraphicsProgram')
import mustBeDefined = require('../checks/mustBeDefined')
import NumberIUnknownMap = require('../collections/NumberIUnknownMap')
import Primitive = require('../geometries/Primitive')
import readOnly = require('../i18n/readOnly')
import refChange = require('../utils/refChange')
import Shareable = require('../utils/Shareable')
import Simplex = require('../geometries/Simplex')
import StringIUnknownMap = require('../collections/StringIUnknownMap')
import simplicesToDrawPrimitive = require('../geometries/simplicesToDrawPrimitive')
import IFacet = require('../core/IFacet')
import uuid4 = require('../utils/uuid4')

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'Drawable'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class Drawable
 * @extends Shareable
 */
class Drawable extends Shareable implements IDrawable {

    /**
     * @property primitives
     * @type {Primitive[]}
     */
    public primitives: Primitive[];

    /**
     * @property graphicsProgram
     * @type {IGraphicsProgram}
     * @private
     */
    public graphicsProgram: IGraphicsProgram;

    /**
     * @property name
     * @type {string}
     * @optional
     */
    public name: string;

    /**
     * FIXME This is a bad name because it is not just a collection of buffersByCanvasId.
     * A map from canvas to IBufferGeometry.
     * It's a function that returns a mesh, given a canvasId a lookup
     */
    private buffersByCanvasId: NumberIUnknownMap<IUnknownArray<IBufferGeometry>>;

    /**
     * @property facets
     * @type {StringIUnknownMap&lt;IFacet&gt;}
     * @private
     */
    private facets: StringIUnknownMap<IFacet>;

    /**
     * @class Drawable
     * @constructor
     * @param primitives {Primitive[]}
     * @param material {IGraphicsProgram}
     */
    constructor(primitives: Primitive[], material: IGraphicsProgram) {
        super(LOGGING_NAME)
        this.primitives = primitives

        this.graphicsProgram = material
        this.graphicsProgram.addRef()

        this.buffersByCanvasId = new NumberIUnknownMap<IUnknownArray<IBufferGeometry>>()

        this.facets = new StringIUnknownMap<IFacet>();
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.primitives = void 0;
        this.buffersByCanvasId.release()
        this.buffersByCanvasId = void 0
        this.graphicsProgram.release()
        this.graphicsProgram = void 0
        this.facets.release()
        this.facets = void 0
    }

    /**
     * @method draw
     * @param [canvasId = 0] {number}
     * @return {void}
     */
    draw(canvasId: number = 0): void {
        // We know we are going to need a "good" canvasId to perform the buffers lookup.
        // So we may as well test that condition now.
        if (isDefined(canvasId)) {
            let material = this.graphicsProgram

            let buffers: IUnknownArray<IBufferGeometry> = this.buffersByCanvasId.getWeakRef(canvasId)
            if (isDefined(buffers)) {
                material.use(canvasId)

                // FIXME: The name is unused. Think we should just have a list
                // and then access using either the real uniform name or a property name.
                this.facets.forEach(function(name, uniform) {
                    uniform.setUniforms(material, canvasId)
                })

                for (var i = 0; i < buffers.length; i++) {
                    var buffer = buffers.getWeakRef(i)
                    buffer.bind(material/*, aNameToKeyName*/) // FIXME: Why not part of the API?
                    buffer.draw()
                    buffer.unbind()
                }
            }
        }
    }

    /**
     * @method contextFree
     * @param [canvasId] {number}
     */
    contextFree(canvasId?: number): void {
        this.graphicsProgram.contextFree(canvasId)
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        // 1. Replace the existing buffer geometry if we have geometry. 
        if (this.primitives) {
            for (var i = 0, iLength = this.primitives.length; i < iLength; i++) {
                var primitive = this.primitives[i]
                if (!this.buffersByCanvasId.exists(manager.canvasId)) {
                    this.buffersByCanvasId.putWeakRef(manager.canvasId, new IUnknownArray<IBufferGeometry>([]))
                }
                var buffers = this.buffersByCanvasId.getWeakRef(manager.canvasId)
                buffers.pushWeakRef(manager.createBufferGeometry(primitive))
            }
        }
        else {
            console.warn("contextGain method has no primitices, canvasId => " + manager.canvasId)
        }
        // 2. Delegate the context to the material.
        this.graphicsProgram.contextGain(manager)
    }

    /**
     * @method contextLost
     * @param [canvasId] {number}
     * @return {void}
     */
    contextLost(canvasId?: number): void {
        this.graphicsProgram.contextLost(canvasId)
    }

    /**
     * @method getFacet
     * @param name {string}
     * @return {IFacet}
     */
    getFacet(name: string): IFacet {
        return this.facets.get(name)
    }

    /**
     * @method setFacet
     * @param name {string}
     * @param facet {IFacet}
     * @return {void}
     */
    setFacet(name: string, facet: IFacet): void {
        this.facets.put(name, facet)
    }

    /**
     * Provides a reference counted reference to the graphics program.
     * @property material
     * @type {IGraphicsProgram}
     * @readOnly
     */
    get material(): IGraphicsProgram {
        this.graphicsProgram.addRef()
        return this.graphicsProgram
    }
    set material(unused) {
        throw new Error(readOnly('material').message)
    }
}

export = Drawable