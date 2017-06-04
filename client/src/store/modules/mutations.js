export const Mutations = {
  signIn: (state, payload) => {
    window.localStorage.setItem('token', payload.token)
    window.localStorage.setItem('user', payload.username)
    window.localStorage.setItem('id', payload.id)
    state.user.push(payload)
    window.location = "/"
  },
  signUp: (state, payload) => {
    state.user.push(payload)
  },
  dataTodos: (state, payload) => {
    state.dataTodos = payload
  }
}