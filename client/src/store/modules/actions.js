export const Actions = {
  signIn: ({commit}, payload) => {
    axios.post('http://localhost:3000/signin', {
      username: payload.username,
      password: payload.password
    })
    .then(response => {
      console.log('Action SignIn');
      console.log(response.data);
      commit('signIn', response.data)
    })
    .catch(error => {
      console.log(error);
      console.log('iiiiiiiii');
    })
  },
  signUp: ({commit}, payload) => {
    axios.post('http://localhost:3000/signup', {
      name: payload.name,
      username: payload.username,
      password: payload.password,
      email: payload.email
    })
    .then(response => {
      console.log('Action SignUp');
      console.log(response.data);
      commit('signUp', response.data)
    })
    .catch(error => {
      console.log(error);
    })
  },
  dataTodos: ({commit}) => {
    axios.get('http://localhost:3000/alltodo')
    .then(response => {
      console.log('Action Get All Todo');
      console.log(response.data);
      commit('dataTodos', response.data)
    })
    .catch(error => {
      console.log(error);
    })
  }
}