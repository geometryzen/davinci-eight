import AttribDataInfos = require('../core/AttribDataInfos');
import AttribMetaInfos = require('../core/AttribMetaInfos');
import DrawMode = require('../core/DrawMode');
import Resource = require('../core/Resource');
/**
 * @class AttribProvider
 */
interface AttribProvider extends Resource {
    /**
     * @method draw
     */
    draw(): void;
    /**
     * @method update
     */
    update(): void;
    /**
     * Provides the data information corresponsing to provided attribute values.
     * @method getAttribData
     * @return {AttribDataInfos} The data information corresponding to all attributes supported.
     */
    getAttribData(): AttribDataInfos;
    /**
     * Provides the meta information corresponsing to provided attribute values.
     * @method getAttribMeta
     * @return {AttribMetaInfos} The meta information corresponding to all attributes supported.
     */
    getAttribMeta(): AttribMetaInfos;
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
}
export = AttribProvider;
