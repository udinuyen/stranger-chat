import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../config'
import Message from './Message'

export default function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [online, setOnline] = useState([])
  const [typing, setTyping] = useState(null)
  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const typingTimeout = useRef(null)

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join', user)
    })

    socket.on('newMessage', (msg) => setMessages((p) => [...p, msg]))
    socket.on('systemMessage', (msg) => setMessages((p) => [...p, { ...msg, system: true }]))
    socket.on('onlineUsers', setOnline)
    socket.on('userTyping', ({ userName, isTyping }) => {
      setTyping(isTyping ? userName : null)
    })

    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!text.trim()) return
    socketRef.current.emit('sendMessage', { text: text.trim() })
    setText('')
    socketRef.current.emit('typing', false)
  }

  const handleChange = (e) => {
    setText(e.target.value)
    socketRef.current?.emit('typing', true)
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      socketRef.current?.emit('typing', false)
    }, 1500)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={{ fontWeight: 700 }}>Stranger Chat</div>
          <div style={{ fontSize: 13, color: '#0084ff' }}>{online.length} online</div>
        </div>
        <button onClick={onLogout} style={styles.logout}>Thoát</button>
      </div>

      <div style={styles.messages}>
        {messages.map((m) => (
          <Message key={m.id || m.time} msg={m} isMe={m.userId === user.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      {typing && (
        <div style={styles.typing}>{typing} đang nhập...</div>
      )}

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Nhập tin nhắn..."
        />
        <button style={styles.send} onClick={send}>Gửi</button>
      </div>
    </div>
  )
}

const styles = {
  container: { height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    background: '#f8f9fa',
  },
  logout: {
    background: 'none',
    border: 'none',
    color: '#db4437',
    fontWeight: 600,
    cursor: 'pointer',
  },
  messages: { flex: 1, overflowY: 'auto', padding: '8px 0' },
  typing: { padding: '0 16px 6px', fontSize: 13, color: '#888', fontStyle: 'italic' },
  inputArea: {
    display: 'flex',
    padding: 12,
    borderTop: '1px solid #eee',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 24,
    border: '1px solid #ddd',
    fontSize: 15,
    outline: 'none',
  },
  send: {
    padding: '0 20px',
    background: '#0084ff',
    color: '#fff',
    border: 'none',
    borderRadius: 24,
    fontWeight: 600,
    cursor: 'pointer',
  },
}
