/**
 * @interface ContextUnique
 */
interface ContextUnique {
    /**
     * The identifier of a canvas must be unique and stable.
     * For speed we assume a low cardinality number.
     */
    canvasId: number;
}

export default ContextUnique;
