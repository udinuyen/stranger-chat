export default function Message({ msg, isMe }) {
  if (msg.system) {
    return (
      <div style={{ textAlign: 'center', margin: '8px 0', color: '#888', fontSize: 13 }}>
        {msg.text}
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
      margin: '6px 12px',
      alignItems: 'flex-end',
    }}>
      {!isMe && (
        msg.avatar ? (
          <img src={msg.avatar} alt="" style={styles.avatar} />
        ) : (
          <div style={{ ...styles.avatar, ...styles.placeholder }}>
            {msg.userName?.[0]?.toUpperCase() || '?'}
          </div>
        )
      )}
      <div style={{
        maxWidth: '75%',
        padding: '10px 14px',
        borderRadius: 16,
        background: isMe ? '#0084ff' : '#e5e5ea',
        color: isMe ? '#fff' : '#000',
        borderBottomRightRadius: isMe ? 4 : 16,
        borderBottomLeftRadius: isMe ? 16 : 4,
      }}>
        {!isMe && (
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, color: '#555' }}>
            {msg.userName}
          </div>
        )}
        <div style={{ fontSize: 15 }}>{msg.text}</div>
        <div style={{
          fontSize: 10,
          marginTop: 4,
          opacity: 0.7,
          textAlign: 'right',
        }}>
          {new Date(msg.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

const styles = {
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    marginRight: 8,
    objectFit: 'cover',
  },
  placeholder: {
    background: '#ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
}