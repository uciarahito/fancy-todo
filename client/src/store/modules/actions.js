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
    axios.get('http://localhost:3000/alltodobyuser', {headers: {
      'id': window.localStorage.getItem('id')
    }})
    .then(response => {
      console.log('Action Get All Todo by user');
      console.log(response.data);
      commit('dataTodos', response.data)
    })
    .catch(error => {
      console.log(error);
    })
  },
  addTodo: ({commit}, payload) => {
    console.log('di action cuyyy');
    console.log(payload);
    axios.post(`http://localhost:3000/createtodo`, {
      title: payload.title,
      content: payload.content,
      dueDate: payload.dueDate,
      user: payload.user
    })
    .then(response => {
      console.log('Action addTodo by user');
      console.log(response);
      commit('addTodo', response.data)
    })
    .catch(error => {
      console.log(error);
    })
  },
  completeTodo: ({commit}, payload) => {
    axios.put(`http://localhost:3000/edittodo/${payload.id}`, {
      isCompleted: payload.isCompleted,
      completedDate: payload.completedDate,
      dueDate: payload.dueDate,
      createdDate: payload.createdDate
    }, {headers: {
      'id': window.localStorage.getItem('id')
    }})
    .then(response => {
      console.log('Action Complete todo');
      console.log(response.data);
      commit('editTodo', response.data)
    })
    .catch(error => {
      console.log(error);
    })
  },
  editTodo: ({commit}, payload) => {
    axios.put(`http://localhost:3000/edittodo/${payload.id}`, {
      title: payload.title,
      content: payload.content,
      completedDate: payload.completedDate,
      createdDate: payload.createdDate,
      user: payload.user,
      dueDate: payload.dueDate
    }, {headers: {
      'id': window.localStorage.getItem('id')
    }})
    .then(response => {
      console.log('Action edit todo');
      console.log(response.data);
      commit('editTodo', response.data)
    })
    .catch(error => {
      console.log(error);
    })
  },
  deleteTodo: ({commit}, payload) => {
    axios.delete(`http://localhost:3000/deletetodo/${payload}`, {headers: {
      'id': window.localStorage.getItem('id')
    }})
    .then(response => {
      console.log('Action delete todo');
      console.log(response.data);
      commit('deleteTodo', response.data)
    })
    .catch(error => {
      console.log(error);
    })
  }
}