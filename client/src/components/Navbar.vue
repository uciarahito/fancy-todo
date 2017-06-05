<template lang="html">
  <div>
    <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">Fancy Todo</el-menu-item>
      <div class="user_menu" style="float:right" v-show="statusLogin == null">
        <el-menu-item index="1" @click="signInDialog">SignIn</el-menu-item>
        <!-- <fb:login-button scope="email, public_profile, publish_actions" onlogin="checkLoginState();"></fb:login-button> -->
        <el-menu-item index="1" @click="signinfb">Signin FB
        </el-menu-item>
        <el-menu-item index="1" @click="signUpDialog">SignUp</el-menu-item>
      </div>

      <el-menu-item index="1" style="float:right" @click="viewAddTodo" v-show="statusLogin">
        <el-tooltip class="item" effect="dark" content="Add new todo" placement="bottom-end">
          <i class="el-icon-plus"></i>
        </el-tooltip>
      </el-menu-item>
      <el-submenu index="2" style="float:right" v-show="statusLogin">
       <template slot="title">Welcome, {{userActive}}</template>
       <el-menu-item index="2-2">Profile</el-menu-item>
       <el-menu-item index="2-3" @click="signOut">SignOut</el-menu-item>
      </el-submenu>
    </el-menu>

    <el-dialog title="SignUp" v-model="dialogFormVisibleSignup">
      <el-form :model="form_signup">
        <el-form-item>
          <el-input v-model="form_signup.name" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form_signup.username" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form_signup.password" placeholder="Password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form_signup.email" placeholder="Email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSignup = false">Cancel</el-button>
        <el-button type="primary" @click="signUp(form_signup);dialogFormVisibleSignup = false;notification('SignUp succes')">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog title="SignIn" v-model="dialogFormVisibleSignin">
      <el-form :model="form_signin">
        <el-form-item>
          <el-input v-model="form_signin.username" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form_signin.password" placeholder="Password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSignin = false">Cancel</el-button>
        <el-button type="primary" @click="signIn(form_signin);dialogFormVisibleSignin = false;">Confirm</el-button>
      </span>
    </el-dialog>
    <img src="../assets/bgtd4.jpg" style="width:70%;" v-show="statusLogin === null">

    <el-dialog title="Add new Todo" v-model="dialogFormVisibleAddTodo">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" style="padding:0px 20px 0px 5px;margin-top:10px;">
        <el-form-item label="Title" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="Activity time" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="Pick a date" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker type="fixed-time" placeholder="Pick a time" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item style="margin-left:0px;">
          <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <Content v-show="statusLogin"></Content>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Content from './Content'

// Proses login facebook-sdk
window.fbAsyncInit = function() {
  FB.init({
    appId      : '413434489050147',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.9'
  });
  FB.AppEvents.logPageView();

  FB.getLoginStatus(function(response) {
    console.log(response);
  });

};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  if (response.status === 'connected') {
    FB.api('/me', {fields: 'first_name, name, email'}, function (apiResponse) {
      console.log(apiResponse);
      window.localStorage.setItem('token', response.authResponse.accessToken);
      window.localStorage.setItem('uuid', apiResponse.id);
      window.localStorage.setItem('user', apiResponse.first_name);
      window.localStorage.setItem('login_method', 'facebook');
      let url = 'http://localhost:3000/signinfb';
      let body = {
        uuid: apiResponse.id,
        email: apiResponse.email,
        name: apiResponse.name
      }
      console.log('ini data body');
      console.log(body);
      axios.post(url, body)
        .then((res) => {
          console.log('Tessss');
          console.log(res);
          window.localStorage.setItem('id', res.data._id);
           window.location = "/"
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    // The person is not logged into your app or we are unable to tell.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  }
}

function fb_login(){
  FB.login(function(response) {
    checkLoginState()
  }, {
    scope: 'email, public_profile, publish_actions'
  });
}

export default {
  components: {
    Content
  },
  data() {
    return {
      form_signup: {
        name: '',
        username: '',
        password: '',
        email: ''
      },
      form_signin: {
        username: '',
        password: ''
      },
      ruleForm: {
        name: '',
        date1: '',
        date2: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' }
        ],
        date1: [
          { type: 'date', required: true, message: 'Please pick a date', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: 'Please pick a time', trigger: 'change' }
        ],
        desc: [
          { required: true, message: 'Please input the content', trigger: 'blur' }
        ]
      },
      dialogFormVisibleSignup: false,
      dialogFormVisibleSignin: false,
      dialogFormVisibleAddTodo: false,
      userActive: ''
    }
  },
  methods: {
    signinfb(){
      fb_login()
    },
    ...mapActions([
      "signIn", "signUp"
    ]),
    signUpDialog(){
      this.dialogFormVisibleSignup = true
    },
    signInDialog(){
      this.dialogFormVisibleSignin = true
    },
    signOut(){
      window.localStorage.clear()
      window.location = "/"
    },
    notification(notif='') {
      if (notif='SignUp succes') {
        this.$message({
          message: 'SignUp succes, you mush signin first!',
          type: 'success'
        });
      }
    },
    viewAddTodo(){
      this.dialogFormVisibleAddTodo = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          // let dueDateX = ''
          // if (this.ruleForm.date1.length > 0 && this.ruleForm.date2.length > 0) {
          //   dueDateX = new Date(`${this.ruleForm.date1} ${this.ruleForm.date2}:00`)
          // }
          // let user = ''
          // if (window.localStorage.getItem('login_method') === 'facebook') {
          //   user = window.localStorage.getItem('id')
          // } else {
          //   user = window.localStorage.getItem('id')
          // }
          let payload = {
            title: this.ruleForm.name,
            content: this.ruleForm.desc,
            dueDate: new Date(`${this.ruleForm.date2}`),
            user: window.localStorage.getItem('id')
          }
          // console.log('data waktu input todo');
          // console.log(this.ruleForm.date1);
          // console.log('typeof: ');
          // console.log(typeof new Date(`${this.ruleForm.date2}`));
          console.log(payload);
          this.$store.dispatch('addTodo', payload)
          this.ruleForm.name = ''
          this.ruleForm.desc = ''
          this.ruleForm.date1 = ''
          this.ruleForm.date2 = ''
          this.dialogFormVisibleAddTodo = false
        } else {
          console.log('error add new todo!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addTodo() {
      let dueDateX = ''
      if (this.ruleForm.date1.length > 0 && this.ruleForm.date2.length > 0) {
        dueDateX = new Date(this.ruleForm.date2)
      }
      let payload = {
        title: this.ruleForm.name,
        content: this.ruleForm.desc,
        dueDate: dueDateX
      }
      this.$store.dispatch('addTodo', payload)
    }
  },
  computed: {
    ...mapGetters({
      statusLogin: "isLogin",
      dataTodos: "dataTodos"
    })
  },
  created() {
    this.userActive = window.localStorage.getItem('user')
  }
}
</script>

<style lang="css">
  .el-select{
    width: 100%
  }
  .el-card {
    text-align: left;
  }
  .el-menu{
    margin-top: -50px;
   border: 1px solid #d9d9d9;
  }
</style>
