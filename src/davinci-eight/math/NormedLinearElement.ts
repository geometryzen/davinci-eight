import LinearElement from './LinearElement'

interface NormedLinearElement<I, M, S, V, MAGNITUDE, SCALING> extends LinearElement<I, M, S, V, MAGNITUDE, SCALING> {
    magnitude(): MAGNITUDE
    squaredNorm(): MAGNITUDE
}

export default NormedLinearElement
