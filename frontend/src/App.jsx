import React, { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    WebApp.ready()      // Telegram сообщает, что WebApp готов
    WebApp.expand()     // Разворачиваем окно WebApp на весь экран

    fetch('http://127.0.0.1:8000/api/ping')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Ошибка при запросе'))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>FitTracker WebApp</h1>
      <p>Ответ от API: <strong>{message}</strong></p>

      <button
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: '#0088cc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
        onClick={() => WebApp.showAlert('Привет из Telegram WebApp!')}
      >
        🚀 Тестовая кнопка
      </button>
    </div>
  )
}

export default App
