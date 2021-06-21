import { floatPrecision } from '@module/utils'

function fileSize(size: number): string {
  if (size > 1024) {
    const kbSize = size / 1024
    if (kbSize > 1024) {
      const mbSize = kbSize / 1024
      return `${floatPrecision(mbSize, 2)} MB`
    }

    return `${Math.round(kbSize)} kB`
  }
  return `${size} B`
}

export { fileSize }
