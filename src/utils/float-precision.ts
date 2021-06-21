function floatPrecision(value: number, precision: number): string {
  const parsed = parseFloat(String(value))

  if (isNaN(parsed)) {
    return parseFloat('0').toFixed(precision)
  } else {
    const power = Math.pow(10, precision)
    const formatted = (Math.round(parsed * power) / power).toFixed(precision)

    return formatted.toString()
  }
}

export { floatPrecision }
