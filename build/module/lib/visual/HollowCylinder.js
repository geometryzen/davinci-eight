import * as tslib_1 from "tslib";
import { Color } from '../core/Color';
import { ds } from './Defaults';
import { GraphicsProgramSymbols as GPS } from '../core/GraphicsProgramSymbols';
import { HollowCylinderGeometry } from '../geometries/HollowCylinderGeometry';
import { offsetFromOptions } from './offsetFromOptions';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { isDefined } from '../checks/isDefined';
import { Mesh } from '../core/Mesh';
import { MeshMaterial } from '../materials/MeshMaterial';
import { mustBeNumber } from '../checks/mustBeNumber';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';
/**
 * A 3D visual representation of a hollow cylinder.
 */
var HollowCylinder = /** @class */ (function (_super) {
    tslib_1.__extends(HollowCylinder, _super);
    /**
     * Constructs a HollowCylinder.
     */
    function HollowCylinder(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('HollowCylinder');
        var geoOptions = { kind: 'HollowCylinderGeometry' };
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        geoOptions.outerRadius = isDefined(options.outerRadius) ? mustBeNumber('outerRadius', options.outerRadius) : ds.radius;
        geoOptions.innerRadius = isDefined(options.innerRadius) ? mustBeNumber('innerRadius', options.innerRadius) : 0.5 * geoOptions.outerRadius;
        geoOptions.sliceAngle = options.sliceAngle;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof HollowCylinderGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new HollowCylinderGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var mmo = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
        mmo.attributes[GPS.ATTRIBUTE_POSITION] = 3;
        mmo.attributes[GPS.ATTRIBUTE_NORMAL] = 3;
        mmo.uniforms[GPS.UNIFORM_COLOR] = 'vec3';
        mmo.uniforms[GPS.UNIFORM_OPACITY] = 'float';
        mmo.uniforms[GPS.UNIFORM_MODEL_MATRIX] = 'mat4';
        mmo.uniforms[GPS.UNIFORM_NORMAL_MATRIX] = 'mat3';
        mmo.uniforms[GPS.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        mmo.uniforms[GPS.UNIFORM_VIEW_MATRIX] = 'mat4';
        mmo.uniforms[GPS.UNIFORM_AMBIENT_LIGHT] = 'vec3';
        mmo.uniforms[GPS.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        mmo.uniforms[GPS.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
        var cachedMaterial = contextManager.getCacheMaterial(mmo);
        if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
            _this.material = cachedMaterial;
            cachedMaterial.release();
        }
        else {
            var material = new MeshMaterial(contextManager, mmo);
            _this.material = material;
            material.release();
            contextManager.putCacheMaterial(mmo, material);
        }
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (isDefined(options.length)) {
            _this.length = mustBeNumber('length', options.length);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    HollowCylinder.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(HollowCylinder.prototype, "length", {
        /**
         * The length of the cylinder, a scalar. Defaults to 1.
         */
        get: function () {
            return this.getScaleY();
        },
        set: function (length) {
            var x = this.getScaleX();
            var z = this.getScaleZ();
            this.setScale(x, length, z);
        },
        enumerable: true,
        configurable: true
    });
    return HollowCylinder;
}(Mesh));
export { HollowCylinder };
