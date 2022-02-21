const KEY = 'Base Color and User Option Data'

export function getData() {
  const { base, options, list } = JSON.parse(localStorage.getItem(KEY))
  return { base, options, list }
}

export function updateData({ base, options, list }) {
  localStorage.setItem(KEY, JSON.stringify({ base, options, list }))
}
