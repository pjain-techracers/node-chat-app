const io = require('socket.io')(4000)
const users = {}

const time =  new Date();
io.on('connection', socket => {
  socket.on('send-chat-msg', msg => {
    socket.broadcast.emit('chat-msg', {msg, name: users[socket.id]})
  })

  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

