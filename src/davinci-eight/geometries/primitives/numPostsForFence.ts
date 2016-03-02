import mustBeInteger from '../../checks/mustBeInteger'

/**
 * Computes the number of posts to build a fence from the number of segments.
 */
export default function(segmentCount: number): number {
  mustBeInteger('segmentCount', segmentCount)
  return segmentCount + 1
}
