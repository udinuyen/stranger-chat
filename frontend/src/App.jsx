import { useState, useEffect } from 'react'
import Login from './components/Login'
import Chat from './components/Chat'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('chatUser')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleLogin = (u) => {
    localStorage.setItem('chatUser', JSON.stringify(u))
    setUser(u)
  }

  const handleLogout = () => {
    localStorage.removeItem('chatUser')
    setUser(null)
  }

  return user ? (
    <Chat user={user} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  )
}