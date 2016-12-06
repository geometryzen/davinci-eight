import GeometryMode from './GeometryMode';
import GeometryOptions from './GeometryOptions';

interface SphereGeometryOptions extends GeometryOptions {
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
