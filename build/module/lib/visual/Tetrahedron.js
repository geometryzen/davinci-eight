import * as tslib_1 from "tslib";
import { Color } from '../core/Color';
import { ds } from './Defaults';
import { materialFromOptions } from './materialFromOptions';
import { Mesh } from '../core/Mesh';
import { offsetFromOptions } from './offsetFromOptions';
import { referenceAxis } from '../core/referenceAxis';
import { referenceMeridian } from '../core/referenceMeridian';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { SimplexMode } from '../geometries/SimplexMode';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { TetrahedronGeometry } from '../geometries/TetrahedronGeometry';
import { spinorE3Object } from './spinorE3Object';
import { vectorE3Object } from './vectorE3Object';
/**
 * A 3D visual representation of a tetrahedron.
 */
var Tetrahedron = /** @class */ (function (_super) {
    tslib_1.__extends(Tetrahedron, _super);
    function Tetrahedron(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis(options, ds.axis).direction(), meridian: referenceMeridian(options, ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Tetrahedron');
        var geoOptions = { kind: 'TetrahedronGeometry' };
        geoOptions.offset = offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object(referenceAxis(options, ds.axis).direction());
        geoOptions.meridian = vectorE3Object(referenceMeridian(options, ds.meridian).direction());
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof TetrahedronGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new TetrahedronGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Tetrahedron.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Tetrahedron.prototype, "radius", {
        /**
         *
         */
        get: function () {
            return this.getScaleX();
        },
        set: function (radius) {
            this.setScale(radius, radius, radius);
        },
        enumerable: true,
        configurable: true
    });
    return Tetrahedron;
}(Mesh));
export { Tetrahedron };
