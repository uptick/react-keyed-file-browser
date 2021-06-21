import { REGEX } from '@module/constants'

function sortByDefault(prev, next): number {
  const aa = String(prev.name).split(REGEX.NUMBER_GROUPS)
  const bb = String(next.name).split(REGEX.NUMBER_GROUPS)
  const min = Math.min(aa.length, bb.length)

  for (let i = 0; i < min; i++) {
    const x = parseFloat(aa[i]) || aa[i].toLowerCase()
    const y = parseFloat(bb[i]) || bb[i].toLowerCase()
    if (x < y) return -1
    else if (x > y) return 1
  }

  return 0
}

export { sortByDefault }
