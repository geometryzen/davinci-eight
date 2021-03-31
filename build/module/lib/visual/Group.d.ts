import { Facet } from '../core/Facet';
import { Renderable } from '../core/Renderable';
import { ShareableBase } from '../core/ShareableBase';
import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';
/**
 * @hidden
 */
export interface GroupMember extends Renderable {
    X: Geometric3;
    R: Geometric3;
    visible: boolean;
}
/**
 * A collection of objects that can be treated as a single Renderable.
 * @hidden
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
    get position(): Geometric3;
    set position(value: Geometric3);
    get X(): Geometric3;
    set X(value: Geometric3);
    /**
     * Attitude (spinor). This is a long alias for the R property.
     */
    get attitude(): Geometric3;
    set attitude(value: Geometric3);
    get R(): Geometric3;
    set R(value: Geometric3);
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
