import GeometryKey from '../core/GeometryKey';
import GeometryMode from './GeometryMode';
import GeometryOptions from './GeometryOptions';
import SphereGeometry from './SphereGeometry';

interface SphereGeometryOptions extends GeometryOptions, GeometryKey<SphereGeometry> {
    azimuthSegments?: number;
    azimuthStart?: number;
    azimuthLength?: number;
    elevationSegments?: number;
    elevationStart?: number;
    elevationLength?: number;
    mode?: GeometryMode;
    radius?: number;
}

export default SphereGeometryOptions;
