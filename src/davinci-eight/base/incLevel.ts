import mustBeInteger from '../checks/mustBeInteger'

/**
 * Increments the level after asserting that it is an integer.
 * deprecated. Just compute levelUp + 1.
 */
export default function(levelUp: number): number {
  return mustBeInteger('levelUp', levelUp) + 1
}