import GeometryMode from './GeometryMode';
import GeometryOptions from './GeometryOptions';

interface SphereGeometryOptions extends GeometryOptions {
    mode?: GeometryMode;
    azimuthSegments?: number;
    azimuthStart?: number;
    azimuthLength?: number;
    elevationSegments?: number;
    elevationStart?: number;
    elevationLength?: number;
    radius?: number;
}

export default SphereGeometryOptions;
