import AttributeSizeType from '../core/AttributeSizeType';
import SimplexMode from './SimplexMode';

/**
 *
 */
interface GeometryMeta {
    k: SimplexMode;
    attributes: { [key: string]: { size: AttributeSizeType; name?: string } };
}

export default GeometryMeta;
