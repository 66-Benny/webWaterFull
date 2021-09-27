<template>
  <div class="webSocketLogin">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item
        label="用户名"
        prop="userName"
        required
      >
        <el-input
          v-model="form.userName"
          placeholder="请输入用户名"
          @keydown.native.enter="onSubmit('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit('ruleForm')"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'webSocketLogin',
  data () {
    return {
      form: { userName: '' },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      const userName = this.form.userName.trim()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          localStorage.setItem('webSocketUserName', userName)
          this.$router.push('/webSocketHome')
        } else {
          return false;
        }
      });
    },
  }
}
</script>
<style scoped>
.webSocketLogin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
}
</style>