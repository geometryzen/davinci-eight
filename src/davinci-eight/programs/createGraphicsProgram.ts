import AttribLocation from '../core/AttribLocation';
import VectorE2 from '../math/VectorE2';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IGraphicsProgram from '../core/IGraphicsProgram';
import Mat2R from '../math/Mat2R';
import Mat3R from '../math/Mat3R';
import Mat4R from '../math/Mat4R';
import MonitorList from '../scene/MonitorList';
import NumberIUnknownMap from '../collections/NumberIUnknownMap';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import uuid4 from '../utils/uuid4';
import UniformLocation from '../core/UniformLocation';
import refChange from '../utils/refChange';
import SimpleWebGLProgram from '../programs/SimpleWebGLProgram';

// We should be able to set this to any integer.
const DEFAULT_CANVAS_ID = 0

/**
 * Name used for reference count monitoring and logging.
 */
const LOGGING_NAME_IMATERIAL = 'IGraphicsProgram'

/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
function missingWebGLRenderingContext(method: string, canvasId: number) {
    console.warn(`${LOGGING_NAME_IMATERIAL} ${method} missing WebGLRenderingContext for canvasId => ${canvasId}. Did you specify the correct canvasId?`);
}
// FIXME: Handle list of shaders? Else createSimpleProgram

export default function createGraphicsProgram(monitors: IContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]): IGraphicsProgram {
    MonitorList.verify('monitors', monitors, () => { return "createGraphicsProgram" })
    // FIXME multi-context
    if (typeof vertexShader !== 'string') {
        throw new Error("vertexShader argument must be a string.")
    }

    if (typeof fragmentShader !== 'string') {
        throw new Error("fragmentShader argument must be a string.")
    }

    var refCount = 1
    /**
     * Because we are multi-canvas aware, programs are tracked by the canvas id.
     */
    var programsByCanvasId = new NumberIUnknownMap<SimpleWebGLProgram>()

    let uuid: string = uuid4().generate()

    var self: IGraphicsProgram = {
        get vertexShader() {
            return vertexShader
        },
        get fragmentShader() {
            return fragmentShader
        },
        attributes(canvasId: number = DEFAULT_CANVAS_ID): { [name: string]: AttribLocation } {
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                return program.attributes;
            }
        },
        uniforms(canvasId: number = DEFAULT_CANVAS_ID): { [name: string]: UniformLocation } {
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                return program.uniforms;
            }
        },
        addRef(): number {
            refChange(uuid, LOGGING_NAME_IMATERIAL, +1)
            refCount++
            return refCount
        },
        release(): number {
            refChange(uuid, LOGGING_NAME_IMATERIAL, -1)
            refCount--
            if (refCount === 0) {
                MonitorList.removeContextListener(self, monitors)
                programsByCanvasId.release()
            }
            return refCount
        },
        contextFree(canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeInteger('canvasId', canvasId)
            const program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                program.contextFree(canvasId)
                programsByCanvasId.remove(canvasId)
            }
        },
        contextGain(manager: IContextProvider): void {
            var canvasId: number
            var sprog: SimpleWebGLProgram
            canvasId = manager.canvasId
            if (!programsByCanvasId.exists(canvasId)) {
                sprog = new SimpleWebGLProgram(manager, vertexShader, fragmentShader, attribs)
                programsByCanvasId.putWeakRef(canvasId, sprog)
            }
            else {
                sprog = programsByCanvasId.getWeakRef(canvasId)
            }
            sprog.contextGain(manager)
        },
        contextLost(canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                program.contextLost(canvasId)
                programsByCanvasId.remove(canvasId)
            }
        },
        get uuid() {
            return uuid
        },
        use(canvasId: number = DEFAULT_CANVAS_ID): void {
            mustBeInteger('canvasId', canvasId)
            const program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                program.use()
            }
            else {
                missingWebGLRenderingContext(`use(canvasId => ${canvasId})`, canvasId);
            }
        },
        enableAttrib(name: string, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            const program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                const attribLoc = program.attributes[name]
                if (attribLoc) {
                    attribLoc.enable()
                }
                else {
                  // Do nothing.
                }
            }
            else {
                missingWebGLRenderingContext(`enableAttrib(name => ${name}, canvasId => ${canvasId})`, canvasId);
            }
        },
        disableAttrib(name: string, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            const program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                const attribLoc = program.attributes[name]
                if (attribLoc) {
                    attribLoc.enable()
                }
                else {
                  // Do nothing.
                }
            }
            else {
              // Do nothing.
            }
        },
        uniform1f(name: string, x: number, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            const program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                const uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.uniform1f(x)
                }
                else {
                    // warning
                }
            }
            else {
                // warning
            }
        },
        uniform2f(name: string, x: number, y: number, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.uniform2f(x, y)
                }
            }
        },
        uniform3f(name: string, x: number, y: number, z: number, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.uniform3f(x, y, z)
                }
            }
        },
        uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.uniform4f(x, y, z, w)
                }
            }
        },
        mat2(name: string, matrix: Mat2R, transpose?: boolean, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.mat2(matrix, transpose)
                }
            }
        },
        mat3(name: string, matrix: Mat3R, transpose?: boolean, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.mat3(matrix, transpose)
                }
            }
        },
        mat4(name: string, matrix: Mat4R, transpose?: boolean, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.mat4(matrix, transpose)
                }
            }
        },
        vec2(name: string, vector: VectorE2, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.vec2(vector)
                }
            }
        },
        vec3(name: string, vector: VectorE3, canvasId: number = DEFAULT_CANVAS_ID) {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.vec3(vector)
                }
            }
        },
        vec4(name: string, vector: VectorE4, canvasId: number = DEFAULT_CANVAS_ID): void {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.vec4(vector)
                }
            }
        },
        vector2(name: string, data: number[], canvasId: number = DEFAULT_CANVAS_ID): void {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.vector2(data)
                }
            }
        },
        vector3(name: string, data: number[], canvasId: number = DEFAULT_CANVAS_ID): void {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.vector3(data)
                }
            }
        },
        vector4(name: string, data: number[], canvasId: number = DEFAULT_CANVAS_ID): void {
            mustBeString('name', name)
            mustBeInteger('canvasId', canvasId)
            let program = programsByCanvasId.getWeakRef(canvasId)
            if (program) {
                let uniformLoc = program.uniforms[name]
                if (uniformLoc) {
                    uniformLoc.vector4(data)
                }
            }
        }
    }
    MonitorList.addContextListener(self, monitors)
    MonitorList.synchronize(self, monitors)
    refChange(uuid, LOGGING_NAME_IMATERIAL, +1)
    return self
}
