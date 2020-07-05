const express = require('express')
const app = express()
// Server will giver us server required to communicate with socket io
const server = require('http').Server(app)
const io = require('socket.io')(server)
const users = {}

app.set('views', './views')
app.set('view engine', 'ejs')
// Use public folder for all the js stuff
app.use(express.static('public'))
// allows url encoded params inside body form
app.use(express.urlencoded({ extended: true }))

const rooms = {}
// Render index page
app.get('/', (req, res) => {
  res.render('index', { rooms })
})

// go to specific room
app.get('/:room', (req, res) => {
  if (!rooms[req.params.room]) {
    res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

// create new room
app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    res.redirect('/')
  } else {
    rooms[req.body.room] = { users: {} }
    res.redirect(req.body.room)
    io.emit('room-created', req.body.room)
  }
})

server.listen(8000, () => {
  console.log("Listening to requests on Port 8000")
})

io.on('connection', socket => {
  socket.on('send-chat-msg', (room, msg) => {
    console.log(room)
    socket.to(room).broadcast.emit('chat-msg', { msg, name: users[socket.id] })
  })

  socket.on('new-user', (room, name) => {
    // join to particular room
    socket.join(room)

    users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
  })

  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(element => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete users[socket.id]
    });
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null)
      names.push(name)
    return names
  }, [])
}
