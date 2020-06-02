const socket = io('http://localhost:4000')
const chatBox = document.getElementById('chat')
const msgForm = document.getElementById('msg-form')
const msg = document.getElementById('message')

const name = prompt('What is your name?')
appendMsg('You joined')
socket.emit('new-user', name)

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

msgForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = msg.value
  appendMsg(`You: ${message}`)
  socket.emit('send-chat-msg', message)
  msg.value = ''
})

function appendMsg(msg) {
  const chatDiv = document.createElement('div')
  chatDiv.innerText = msg
  chatBox.append(chatDiv)

}
