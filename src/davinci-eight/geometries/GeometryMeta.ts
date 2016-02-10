/**
 *
 */
interface GeometryMeta {
    k: number;
    attributes: { [key: string]: { size: number; name?: string } };
}

export default GeometryMeta;
