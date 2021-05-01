export function getSize(input: number | string) {
  if (typeof input === 'number' || /^[\d.]+$/.test(input)) {
    return input + 'pt'
  } else if (input.includes('%')) {
    return input
  }
  return parseFloat(input) + 'pt'
}
