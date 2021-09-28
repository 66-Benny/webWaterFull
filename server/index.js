const Ws = require('ws')

;((Ws) => {
  const server = new Ws.Server({ noServer: true })
  const init = () => {
    bindEvent()
  }
  function bindEvent() {
    server.on('open', handleOpen)
    server.on('close', handleClose)
    server.on('error', handleError)
    server.on('connection', handleConnection)
  }
  function handleOpen() {}
  function handleClose() {}
  function handleError() {}
  function handleConnection(socket) {
    socket.on('message', handleMessage)
  }
  function handleMessage(msg) {
    server.clients.forEach((c) => {
      c.send(msg.toString())
    })
  }
  init()
})(Ws)
