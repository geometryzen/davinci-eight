import { Facet } from '../core/Facet';
import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';
import { Renderable } from '../core/Renderable';
import { ShareableBase } from '../core/ShareableBase';
/**
 *
 */
export interface GroupMember extends Renderable {
    X: Geometric3;
    R: Geometric3;
    visible: boolean;
}
/**
 * A collection of objects that can be treated as a single Renderable.
 */
export declare class Group extends ShareableBase implements GroupMember {
    /**
     * The members of this group.
     */
    private members;
    /**
     * Position (vector). This is a short alias for the position property.
     */
    private pos;
    /**
     * Attitude (spinor). This is a short alias for the attitude property.
     */
    private att;
    /**
     *
     */
    stress: Matrix4;
    /**
     * Determines whether this group will be rendered.
     */
    visible: boolean;
    /**
     * Constructs
     */
    constructor();
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     * Position (vector). This is a long alias for the X property.
     */
    position: Geometric3;
    X: Geometric3;
    /**
     * Attitude (spinor). This is a long alias for the R property.
     */
    attitude: Geometric3;
    R: Geometric3;
    /**
     * Adds a Renderable item to this Group.
     */
    add(member: GroupMember): void;
    /**
     * Removes a member item from this Group.
     */
    remove(member: GroupMember): void;
    /**
     * Renders all the members of this Group.
     */
    render(ambients: Facet[]): void;
}
