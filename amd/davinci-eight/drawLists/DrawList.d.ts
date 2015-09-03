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
    /**
     * Sets the uniform of the specied name to the specified value on all programs.
     */
    setUniform3fv(name: string, value: number[]): any;
    /**
     *
     */
    setUniformMatrix4fv(name: string, matrix: Float32Array, transpose: boolean): any;
}
export = DrawList;
