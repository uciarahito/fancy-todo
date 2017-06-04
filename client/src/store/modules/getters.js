export const Getters = {
  dataTodos: (state) => {
    return state.dataTodos
  },
  isLogin: (state) => {
    return window.localStorage.getItem('token')
  }
}