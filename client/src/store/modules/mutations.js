export const Mutations = {
  signIn: (state, payload) => {
    window.localStorage.setItem('token', payload.token)
    window.localStorage.setItem('user', payload.username)
    window.localStorage.setItem('id', payload.id)
    window.localStorage.setItem('login_method', 'local');
    state.user.push(payload)
    window.location = "/"
  },
  signUp: (state, payload) => {
    state.user.push(payload)
  },
  dataTodos: (state, payload) => {
    state.dataTodos = payload
  },
  addTodo: (state, payload) => {
    state.dataTodos.push(payload)
  },
  editTodo: (state, payload) => {
    state.dataTodos = payload
    window.location = "/"
  },
  deleteTodo: (state, payload) => {
    state.dataTodos = payload
    window.location = "/"
  }
}