/**
 * Initially used to give me a canvasId.
 * Using the big-enough space principle to avoid collisions.
 */
export default function randumbInteger() {
    let r = Math.random()
    let s = r * 1000000
    let i = Math.round(s)
    return i
}
