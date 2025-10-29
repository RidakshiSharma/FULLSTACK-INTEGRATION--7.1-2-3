const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

// allow frontend dev server origin (adjust if serving from different port/origin)
app.use(cors())

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // receive "join" event with username (optional)
  socket.on('join', (username) => {
    socket.username = username || 'Anonymous'
    // notify everyone that user joined
    io.emit('systemMessage', {
      message: `${socket.username} joined the chat.`,
      timestamp: new Date().toISOString()
    })
  })

  // receive chat messages from clients
  socket.on('chatMessage', (msg) => {
    const payload = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 9),
      user: socket.username || 'Anonymous',
      message: msg,
      timestamp: new Date().toISOString()
    }
    // broadcast to all clients (including sender)
    io.emit('chatMessage', payload)
  })

  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id} (${reason})`)
    if (socket.username) {
      io.emit('systemMessage', {
        message: `${socket.username} left the chat.`,
        timestamp: new Date().toISOString()
      })
    }
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`)
})
