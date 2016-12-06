import GeometryOptions from './GeometryOptions';

interface SphereGeometryOptions extends GeometryOptions {
    azimuthSegments?: number;
    azimuthStart?: number;
    azimuthLength?: number;
    elevationSegments?: number;
    elevationStart?: number;
    elevationLength?: number;
    radius?: number;
}

export default SphereGeometryOptions;
