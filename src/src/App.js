import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const SOCKET_URL = 'http://localhost:5000'

function App() {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([]) // {id, user, message, timestamp}
  const [systemMessages, setSystemMessages] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const s = io(SOCKET_URL)
    setSocket(s)

    s.on('connect', () => {
      setConnected(true)
    })

    s.on('disconnect', () => {
      setConnected(false)
    })

    s.on('chatMessage', (payload) => {
      setMessages(prev => [...prev, payload])
    })

    s.on('systemMessage', (payload) => {
      setSystemMessages(prev => [...prev, payload])
    })

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    // scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, systemMessages])

  const joinChat = () => {
    if (!socket) return
    socket.emit('join', name || 'Anonymous')
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() || !socket) return
    socket.emit('chatMessage', message.trim())
    setMessage('')
  }

  return (
    <div className="app">
      <div className="chat-container">
        <header className="chat-header">
          <h1>Realtime Chat</h1>
          <div className={`status ${connected ? 'online' : 'offline'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </header>

        <div className="join-box">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={joinChat} disabled={!socket || !connected}>Join</button>
        </div>

        <main className="messages">
          {systemMessages.map((s, idx) => (
            <div key={`sys-${idx}`} className="system-msg">
              <small>{new Date(s.timestamp).toLocaleTimeString()} — {s.message}</small>
            </div>
          ))}

          {messages.map(m => (
            <div key={m.id} className="message">
              <div className="message-meta">
                <strong>{m.user}</strong>
                <span className="time">{new Date(m.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="message-body">{m.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>

        <form className="input-area" onSubmit={sendMessage}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!connected}
          />
          <button type="submit" disabled={!connected || !message.trim()}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default App
