import AttributeMetaInfos = require('../core/AttributeMetaInfos');
import DataUsage = require('../core/DataUsage');
import DrawMode = require('../core/DrawMode');
import ShaderVariableDecl = require('../core/ShaderVariableDecl');
/**
 * @class AttributeProvider
 */
interface AttributeProvider {
    /**
     * @method draw
     * @param context {WebGLRenderingContext}
     */
    draw(context: WebGLRenderingContext): void;
    /**
     * @method update
     */
    update(attributes: ShaderVariableDecl[]): void;
    /**
     * Provides the values required for vertex shader attributes.
     * @method getAttributeData
     * @return {Float32Array} The array of attribute values.
     */
    getVertexAttributeData(name: string): {
        usage: DataUsage;
        data: Float32Array;
    };
    /**
     * Provides the meta information corresponsing to provided attribute values.
     * @method getAttributeMetaInfos
     * @return {AttributeMetaInfos} The meta information corresponding to all attributes supported.
     */
    getAttributeMetaInfos(): AttributeMetaInfos;
    /**
     * @property drawMode
     * @type number
     * Determines how the thing will be rendered.
     */
    drawMode: DrawMode;
    /**
     * Determines when and how often the update method is called.
     * @property dynamic
     * @type boolean
     */
    dynamic: boolean;
    /**
     * Determines whether this attribute provider uses vetex indexing.
     * @method hasElements
     * @return {Boolean} true if the provider uses vertex indexing.
     */
    hasElements(): boolean;
    /**
     * @method getElements
     * @return {usage: DataUsage; data:Unit16Array} The array of vertex indices.
     */
    getElements(): {
        usage: DataUsage;
        data: Uint16Array;
    };
}
export = AttributeProvider;
