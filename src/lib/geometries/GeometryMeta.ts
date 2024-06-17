import { AttributeSizeType } from "../core/AttributeSizeType";
import { SimplexMode } from "./SimplexMode";

/**
 * @hidden
 */
export interface GeometryMeta {
    k: SimplexMode;
    attributes: { [key: string]: { size: AttributeSizeType; name?: string } };
}
