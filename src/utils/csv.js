export function parseCSV (text) {
  const lines = text.trim().split(/\r?\n/)
  const [header, ...rows] = lines
  const h = header.split(',')
  const idxC = h.indexOf('clip')
  const idxW = h.indexOf('weight')
  const idxD = h.indexOf('duration')
  return rows
    .map(r => r.split(','))
    .filter(c => c[idxC])
    .map(c => ({
      clip: c[idxC].trim(),
      weight: Number(c[idxW] || 3),
      duration: Number(c[idxD] || 24)
    }))
}

export const getClip = (arr, name) => arr.find(c => c.clip === name) || { clip: name, weight: 3, duration: 24 }
