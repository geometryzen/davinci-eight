import SimplexMode from './SimplexMode';

/**
 *
 */
interface GeometryMeta {
    k: SimplexMode;
    attributes: { [key: string]: { size: number; name?: string } };
}

export default GeometryMeta;
