import { ref } from 'vue'

export default function useLastedToken() {
  const set = ref(new Set())
  const cur = ref(null)

  const getLastedToken = () => {
    let token = Math.random()
    while (set.value.has(token)) {
      token = Math.random()
    }
    set.value.add(token)
    cur.value = token
    return token
  }

  const comsumeToken = (token, fn) => {
    set.value.delete(token)
    if (cur.value === token) {
      fn?.()
    }
  }

  return {
    getLastedToken,
    comsumeToken
  }
}
