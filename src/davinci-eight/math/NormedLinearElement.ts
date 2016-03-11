import LinearNumber from './LinearNumber'

interface NormedLinearElement<I, M, S, V, MAGNITUDE, SCALING> extends LinearNumber<I, M, S, V, MAGNITUDE, SCALING> {
    magnitude(): MAGNITUDE
    squaredNorm(): MAGNITUDE
}

export default NormedLinearElement
