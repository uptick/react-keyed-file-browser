const NUMBER_GROUPS = /(-?\d*\.?\d+)/g

function naturalSortComparer(a, b) {
  const aa = String(a.name).split(NUMBER_GROUPS)
  const bb = String(b.name).split(NUMBER_GROUPS)
  const min = Math.min(aa.length, bb.length)

  for (let i = 0; i < min; i++) {
    const x = parseFloat(aa[i]) || aa[i].toLowerCase()
    const y = parseFloat(bb[i]) || bb[i].toLowerCase()
    if (x < y) return -1
    else if (x > y) return 1
  }

  return 0
}

export { naturalSortComparer }
