define(["require", "exports", '../core/DataUsage'], function (require, exports, DataUsage) {
    function convertUsage(usage, context) {
        switch (usage) {
            case DataUsage.DYNAMIC_DRAW: {
                return context.DYNAMIC_DRAW;
            }
            case DataUsage.STATIC_DRAW: {
                return context.STATIC_DRAW;
            }
            case DataUsage.STREAM_DRAW: {
                return context.STREAM_DRAW;
            }
            default: {
                throw new Error("Unexpected usage: " + usage);
            }
        }
    }
    return convertUsage;
});
