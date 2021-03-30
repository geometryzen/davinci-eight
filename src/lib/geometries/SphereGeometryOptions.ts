import { GeometryKey } from '../core/GeometryKey';
import { GeometryMode } from './GeometryMode';
import { GeometryOptions } from './GeometryOptions';

/**
 * @hidden
 */
export interface SphereGeometryOptions extends GeometryOptions, GeometryKey {
    azimuthSegments?: number;
    azimuthStart?: number;
    azimuthLength?: number;
    elevationSegments?: number;
    elevationStart?: number;
    elevationLength?: number;
    mode?: GeometryMode;
    radius?: number;
}
