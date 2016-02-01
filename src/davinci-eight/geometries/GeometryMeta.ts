/**
 * @class GeometryMeta
 */
interface GeometryMeta {
    /**
     * The dimesionality of the simplices, assumed to be homogenous.
     * @property k
     * @type {number}
     */
    k: number;
    /**
     * The properties of the attributes.
     * The size refers to the size of the GLSL type, not the chunking size.
     * The name is an override of the key that produces the variable name.
     */
    attributes: { [key: string]: { size: number; name?: string } };
}

export default GeometryMeta;
