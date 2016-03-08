import mustBeInteger from '../checks/mustBeInteger'

/**
 * Increments the level after asserting that it is an integer.
 * This should be used in constructors derived from ShareableBase.
 */
export default function(level: number): number {
  return mustBeInteger('level', level) + 1
}