/**
 *
 */
export class TrailConfig {
    /**
     *
     */
    public enabled = true;

    /**
     * Determines the number of animation frames between the recording of events.
     */
    public interval = 10;

    /**
     * Determines the maximum number of historical events that form the trail.
     */
    public retain = 10;
}
