<template lang="html">
  <div>
    <h1 >{{greeting}},</h1>
    <!-- <h2>{{todosReport}}</h2> -->
    <!-- {{dataTodos}} -->
    <el-row :gutter="20" v-if="dataTodos.length > 0">
      <el-col :span="20" :offset="2">
        <div class="grid-content">
          <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition" style="width: 100%;">
            <div class="el-table__header-wrapper">
              <table style="width:100%;">
                <thead>
                  <tr>
                    <th>
                      <div class="cell">No</div>
                    </th>
                    <th style="width:205px;">
                      <div class="cell">
                        Todo list
                        <span class="caret-wrapper">
                          <span @click="titleSortAsc">
                            <i class="sort-caret ascending"></i>
                          </span>
                          <span @click="titleSortDesc">
                            <i class="sort-caret descending"></i>
                          </span>
                        </span>
                      </div>
                    </th>
                    <th>
                      <div class="cell">
                        Created Date
                        <span class="caret-wrapper">
                          <span @click="createdAtSortAsc">
                            <i class="sort-caret ascending"></i>
                          </span>
                          <span @click="createdAtSortDesc">
                            <i class="sort-caret descending"></i>
                          </span>
                        </span>
                      </div>
                    </th>
                    <th>
                      <div class="cell">
                        Due Date
                        <span class="caret-wrapper">
                          <span @click="dueDateSortAsc">
                            <i class="sort-caret ascending"></i>
                          </span>
                          <span @click="dueDateSortDesc">
                            <i class="sort-caret descending"></i>
                          </span>
                        </span>
                      </div>
                    </th>
                    <th>
                      <div class="cell">
                        Completed Date
                        <span class="caret-wrapper">
                          <span @click="dueDateSortAsc">
                            <i class="sort-caret ascending"></i>
                          </span>
                          <span @click="dueDateSortDesc">
                            <i class="sort-caret descending"></i>
                          </span>
                        </span>
                      </div>
                    </th>
                    <th>
                      <div class="cell">Status</div>
                    </th>
                    <th>
                      <div class="cell">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody style="text-align:-webkit-auto;">
                  <tr v-for="(todo, index) in dataTodos">
                    <td>
                      <div class="cell">{{index +1}}</div>
                    </td>
                    <td>
                      <div class="cell">
                        <p><b>{{todo.title}}</b></p>
                        <p>{{todo.content}}</p>
                      </div>
                    </td>
                    <td>
                      <div class="cell">{{convertDate(todo.createdDate)}}</div>
                    </td>
                    <td>
                      <div class="cell">
                        <p v-if="todo.dueDate !== null">{{convertDate(todo.dueDate)}}</p>
                        <p v-else>Not defined</p>
                        <p v-if="todo.dueDate !== null">{{convertTime(todo.dueDate)}}</p>
                        <p v-else>Not defined</p>
                      </div>
                    </td>
                    <td>
                      <div class="cell">
                        <p v-if="todo.completedDate !== null">{{convertDate(todo.completedDate)}}</p>
                        <p v-if="todo.completedDate !== null">{{convertTime(todo.completedDate)}}</p>
                      </div>
                    </td>
                    <td>
                      <div class="cell">
                        <p v-if="todo.isCompleted === true">Done!</p>
                      </div>
                    </td>
                    <td>
                      <div class="cell">
                        <button v-if="todo.isCompleted === false" @click="viewEditTodo(index)" type="button" class="el-button el-button--default el-button--small">
                          <span>Edit</span>
                        </button>
                        <button @click.prevent="deleteTodo(index)" type="button" class="el-button el-button--danger el-button--small">
                          <span>Delete</span>
                        </button>
                        <button v-if="todo.isCompleted === false" @click.prevent="complete(index)" type="button" class="el-button el-button--default el-button--small">
                          <span>Complete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="Edit Todo" v-model="dialogFormVisibleEditTodo">
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
          <el-button type="primary" @click="submitForm('ruleForm')">Edit</el-button>
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      ruleForm: {
        name: '',
        date1: '',
        date2: '',
        desc: '',
        index: 0
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
          { required: true, message: 'Please input activity form', trigger: 'blur' }
        ]
      },
      dialogFormVisibleEditTodo: false,
      greeting: '',
      todosReport: ''
    }
  },
  methods: {
    formatter(row, column) {
      return row.address;
    },
    dueDateSortAsc: function() {
      this.dataTodos.sort(function(a, b) {
        if (a.dueDate === null) {
          return 1;
        } else if (b.dueDate === null) {
          return -1;
        } else if (a.dueDate === b.dueDate) {
          return 0;
        } else {
          return (a.dueDate > b.dueDate);
        }
      });
    },
    dueDateSortDesc: function() {
      this.dataTodos.sort(function(a, b) {
        if (a.dueDate === null) {
          return 1;
        } else if (b.dueDate === null) {
          return -1;
        } else if (a.dueDate === b.dueDate) {
          return 0;
        } else {
          return (a.dueDate < b.dueDate);
        }
      });
    },
    viewEditTodo(index){
      this.dialogFormVisibleEditTodo = true
      this.ruleForm.index = index
      this.ruleForm.name = this.dataTodos[index].title
      this.ruleForm.desc = this.dataTodos[index].content
      console.log('Cek due date edit');
      console.log(this.dataTodos);
      console.log(this.ruleForm.index);
      this.ruleForm.date1 = this.convertDate(this.dataTodos[index].dueDate)
    },
    deleteTodo(index){
      let title = this.dataTodos[index].title
      if (confirm(`Are you sure want to delete ${title} from the list?`)) {
        this.$store.dispatch('deleteTodo', this.dataTodos[index]._id)
        this.dataTodos.splice(index, 1)
      }
      this.$store.state.dataTodos
      this.outstandingCheck()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          let Duedate
          if (this.ruleForm.date2 !== null) {
              Duedate = new Date(this.ruleForm.date2)
          }

          let payload = {
            id: this.dataTodos[this.ruleForm.index]._id,
            title: this.ruleForm.name,
            content: this.ruleForm.desc,
            completedDate: this.dataTodos[this.ruleForm.index].completedDate,
            createdDate: this.dataTodos[this.ruleForm.index].createdDate,
            user: window.localStorage.getItem('id'),
            dueDate: Duedate
          }
          console.log('masuk gak ya??');
          console.log(payload);

          console.log('data inputan waktu edit');
          console.log(payload);
          this.$store.dispatch('editTodo', payload)
          this.dialogFormVisibleEditTodo = false
          this.$store.state.dataTodos
          this.outstandingCheck()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    greet() {
      let now = new Date();
      let hour = now.getHours();
      if(hour < 10) {
        this.greeting = "Good morning";
      } else if(hour < 12) {
        this.greeting = "Good day";
      } else if(hour < 18) {
        this.greeting = "Good afternoon";
      } else if(hour < 24 || hour < 3) {
        this.greeting = "Good evening";
      }
    },
    convertDate(oriDate) {
      let getDate = new Date(oriDate);
      let year = String(getDate.getFullYear());
      let month = String(getDate.getMonth()+1);
      if(month.length === 1) {
        month = '0' + month;
      }
      let date = String(getDate.getDate());
      if(date.length === 1) {
        date = '0' + date;
      }
      return `${year}-${month}-${date}`;
    },
    convertTime(oriDate) {
      let getDate = new Date(oriDate);
      let hour = String(getDate.getHours());
      if(hour.length === 1) {
        hour = '0' + hour;
      }
      let minute = String(getDate.getMinutes());
      if(minute.length === 1) {
        minute = '0' + minute;
      }
      return `${hour}:${minute}`;
    },
    complete(index) {
      let payload = {
        id: this.dataTodos[index]._id,
        isCompleted: true,
        completedDate: new Date(),
        dueDate: this.dataTodos[index].dueDate,
        createdDate: this.dataTodos[index].createdDate
      }
      this.$store.dispatch('completeTodo', payload)
      this.dataTodos[index].isCompleted = true
      this.dataTodos[index].completedDate = new Date()
      // this.dataTodos()
      this.outstandingCheck()
    },
    outstandingCheck() {
      let outstanding = this.dataTodos.filter(todo => {
        return todo.isCompleted === false;
      });

      let task = 'task';
      if(outstanding.length == 1) {
        this.message = '';
      } else if(outstanding.length > 1) {
        task+='s';
        this.message = '';
      } else {
        this.message = 'There is nothing to do!'
      }

      this.todosReport = `You have ${outstanding.length} ${task} to do`;
    },
    titleSortAsc() {
      this.dataTodos.sort(function(a, b) {
        return (a.title.toLowerCase()).localeCompare(b.title.toLowerCase());
      });
    },
    titleSortDesc() {
      this.dataTodos.sort(function(a, b) {
        return (b.title.toLowerCase()).localeCompare(a.title.toLowerCase());
      });
    },
    createdAtSortAsc() {
      this.dataTodos.sort(function(a, b) {
        return (a.createdDate > b.createdDate);
      });
    },
    createdAtSortDesc() {
      this.dataTodos.sort(function(a, b) {
        return (a.createdDate < b.createdDate);
      });
    },
    completedAtSortAsc: function() {
      this.dataTodos.sort(function(a, b) {
        if (a.completedDate === null) {
          return 1;
        } else if (b.completedDate === null) {
          return -1;
        } else if (a.completedDate === b.completedDate) {
          return 0;
        } else {
          return a.completedDate > b.completedDate;
        }
      });
    },
    completedAtSortDesc: function() {
      this.dataTodos.sort(function(a, b) {
        if (a.completedDate === null) {
          return 1;
        } else if (b.completedDate === null) {
          return -1;
        } else if (a.completedDate === b.completedDate) {
          return 0;
        } else {
          return a.completedDate < b.completedDate;
        }
      });
    }
  },
  created() {
    this.greet()
    this.$store.dispatch("dataTodos")
    this.outstandingCheck()
  },
  computed: {
    ...mapGetters({
      statusLogin: 'isLogin',
      dataTodos: 'dataTodos'
    }),
    dataTodos(){
      return this.$store.state.dataTodos
    }
  }
}
</script>

<style lang="css">
</style>
