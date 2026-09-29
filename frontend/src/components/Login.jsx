import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')

  const handleGuest = () => {
    if (!name.trim()) {
      alert('Nhập tên để vào chat')
      return
    }
    onLogin({
      id: 'guest_' + Date.now(),
      name: name.trim(),
      avatar: null,
    })
  }

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      onLogin({
        id: decoded.sub,
        name: decoded.name,
        avatar: decoded.picture,
        email: decoded.email,
      })
    } catch (e) {
      alert('Lỗi đăng nhập Google')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Stranger Chat</h1>
        <p style={styles.sub}>Chat với người lạ cùng WiFi</p>

        <input
          style={styles.input}
          placeholder="Nhập tên (Guest)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />

        <button style={styles.btnGuest} onClick={handleGuest}>
          Vào chat (Guest)
        </button>

        <div style={styles.divider}>
          <span>hoặc</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Đăng nhập Google thất bại')}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 380,
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  },
  title: { textAlign: 'center', marginBottom: 8, fontSize: 28 },
  sub: { textAlign: 'center', color: '#666', marginBottom: 24 },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    border: '1px solid #ddd',
    fontSize: 16,
    marginBottom: 16,
  },
  btnGuest: {
    width: '100%',
    padding: 14,
    background: '#0084ff',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    color: '#999',
    fontSize: 14,
  },
}