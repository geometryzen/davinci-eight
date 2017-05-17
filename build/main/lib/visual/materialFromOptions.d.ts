import { ContextManager } from '../core/ContextManager';
import { Material } from '../core/Material';
import { SimplexMode } from '../geometries/SimplexMode';
/**
 * Behaviors are what the end-user cares about.
 * These must be translated into implementation details.
 */
export interface MaterialBehaviors {
    textured?: boolean;
    transparent?: boolean;
    emissive?: boolean;
    colored?: boolean;
    reflective?: boolean;
}
/**
 *
 */
export declare function materialFromOptions(contextManager: ContextManager, simplexMode: SimplexMode, behaviors: MaterialBehaviors): Material;
