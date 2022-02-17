const KEY = 'Base Color and User Option Data'

export function getData() {
  const { base, options } = JSON.parse(localStorage.getItem(KEY))
  return { base, options }
}

export function updateData({ base, options }) {
  localStorage.setItem(KEY, JSON.stringify({ base, options }))
}
