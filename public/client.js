const socket = io('http://localhost:4000')
const chatBox = document.getElementById('chat')
const msgForm = document.getElementById('msg-form')
const msg = document.getElementById('message')
const roomContainer = document.getElementById('room')

if (msgForm != null) {
  const name = prompt('What is your name?')
  appendMsg('You joined')
  socket.emit('new-user', roomName, name)

  msgForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = msg.value
    appendMsg(`You: ${message}`)
    socket.emit('send-chat-msg', roomName, message)
    msg.value = ''
  })
}

// event name with the sata we got from server
socket.on('chat-msg', data => {
  appendMsg(`${data.name}: ${data.msg}`)
})

socket.on('user-connected', name => {
  appendMsg(`${name} joined`)
})

socket.on('user-disconnected', name => {
  appendMsg(`${name} disconnected`)
})

socket.on('room-created', roomName => {
  const roomEle = document.createElement('div')
  roomEle.innerText = roomName
  const roomLink = document.createElement('a')
  roomLink.href = `/${roomName}`
  roomLink.innerText = "Join"
  roomContainer.append(roomEle)
  roomContainer.append(roomLink)
})

function appendMsg(msg) {
  const chatDiv = document.createElement('div')
  chatDiv.innerText = msg
  chatBox.append(chatDiv)

}
