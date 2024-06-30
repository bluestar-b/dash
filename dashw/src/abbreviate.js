function abbreviateNumber(value) {
  if (value < 1000000) {
    return value
  }

  let newValue = value
  const suffixes = ["", "K", " million", " billion", " trillion"]
  let suffixNum = 0
  while (newValue >= 1000) {
    newValue /= 1000
    suffixNum++
  }

  newValue = newValue.toPrecision(3)

  newValue += suffixes[suffixNum]
  return newValue
}

export default abbreviateNumber
