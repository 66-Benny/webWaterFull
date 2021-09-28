<template>
  <div class="webSocketHome">
    <perfect-scrollbar>
      <div class="list">
        <ul>
          <li
            v-for="item of listArr"
            :key="item.id"
          >
            <p>{{item.user}}: {{item.message}}</p>
          </li>
        </ul>
      </div>
    </perfect-scrollbar>
    <el-input
      type="textarea"
      :rows="4"
      placeholder="请输入内容, 并按回车键发送"
      v-model="message"
      @keydown.native="handleKeyCode($event)"
    >
    </el-input>
  </div>
</template>
<script>
const ws = new WebSocket('ws://bennyluo.cf:666')
export default {
  name: 'webSocketHome',
  data () {
    return { listArr: [], message: '', userName: '' }
  },
  mounted () {
    this.userName = localStorage.getItem("webSocketUserName")
    if (!this.userName) {
      this.$router.push('/webSocketLogin')
    }
    ws.addEventListener('open', this.handleWsOpen.bind(this), false)
    ws.addEventListener('close', this.handleWsClose.bind(this), false)
    ws.addEventListener('error', this.handleWsError.bind(this), false)
    ws.addEventListener('message', this.handleWsMessage.bind(this), false)
  },
  methods: {
    handleKeyCode (event) {
      if (event.ctrlKey && event.keyCode === 13) {
        this.message = this.message + '\n'
      }
      if (event.ctrlKey === false && event.keyCode === 13) {
        event.preventDefault();
        this.handleTextSend();
      }
    },
    handleTextSend () {
      const message = this.message.trim()
      if (!message.length) {
        return false
      }
      ws.send(JSON.stringify({
        id: new Date().getTime(),
        user: this.userName,
        dateTime: new Date().getTime(),
        message: this.message
      }))
    },
    handleWsOpen (e) { console.log('handleWsOpen', e); },
    handleWsClose (e) {
      console.log('handleWsClose', e);
      this.handleTextSend();
    },
    handleWsError (e) { console.log('handleWsError', e); },
    handleWsMessage (e) {
      this.listArr.push(JSON.parse(e.data))
      this.message = ''
    }
  }
}
</script>
<style lang="less" scoped>
.webSocketHome {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  border: 1px solid #ccc;
  .ps {
    height: 500px;
    width: 100%;
    .list {
      height: 100%;
      background: #f2f8ff;
      ul li {
        list-style-type: none;
        text-align: left;
      }
    }
  }
}
</style>