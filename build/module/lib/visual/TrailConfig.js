/**
 *
 */
var TrailConfig = (function () {
    function TrailConfig() {
        /**
         *
         */
        this.enabled = true;
        /**
         * Determines the number of animation frames between the recording of events.
         */
        this.interval = 10;
        /**
         * Determines the maximum number of historical events that form the trail.
         */
        this.retain = 10;
    }
    return TrailConfig;
}());
export { TrailConfig };
