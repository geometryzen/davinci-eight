import Drawable = require('../core/Drawable');
import RenderingContextUser = require('../core/RenderingContextUser');
import UniformDataInfos = require('../core/UniformDataInfos');
interface DrawList extends RenderingContextUser {
    add(drawable: Drawable): void;
    remove(drawable: Drawable): void;
    traverse(callback: (value: Drawable, index: number, array: Drawable[]) => void): void;
    /**
     * Sets the uniforms provided into all programs.
     */
    setUniforms(values: UniformDataInfos): any;
    uniform1f(name: string, x: number, picky?: boolean): any;
    uniform1fv(name: string, value: number[], picky?: boolean): any;
    uniform2f(name: string, x: number, y: number, picky?: boolean): any;
    uniform2fv(name: string, value: number[], picky?: boolean): any;
    uniform3f(name: string, x: number, y: number, z: number, picky?: boolean): any;
    uniform3fv(name: string, value: number[], picky?: boolean): any;
    uniform4f(name: string, x: number, y: number, z: number, w: number, picky?: boolean): any;
    uniform4fv(name: string, value: number[], picky?: boolean): any;
    uniformMatrix2fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean): any;
    uniformMatrix3fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean): any;
    uniformMatrix4fv(name: string, transpose: boolean, matrix: Float32Array, picky?: boolean): any;
}
export = DrawList;
