import React, { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

function App() {
  const [message, setMessage] = useState('')
  const [workout, setWorkout] = useState([])
  const [totalKcal, setTotalKcal] = useState(0)
  const username = WebApp.initDataUnsafe.user?.username || "testuser"

  useEffect(() => {
    WebApp.ready()
    WebApp.expand()

    fetch('https://fittrackerpro-backend.onrender.com/api/ping')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Ошибка при запросе'))
  }, [])

  const startCycle = async () => {
    await fetch('https://fittrackerpro-backend.onrender.com/api/start_cycle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, weeks: 8, split: 3 })
    })
    WebApp.showAlert('Цикл запущен!')
  }

  const getWorkout = async () => {
    const res = await fetch(`https://fittrackerpro-backend.onrender.com/api/workout?username=${username}`)
    const data = await res.json()
    setWorkout(data.workout || [])
  }

  const addFood = async () => {
    await fetch('https://fittrackerpro-backend.onrender.com/api/calories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        product: 'Гречка',
        protein: 12,
        fat: 3,
        carbs: 60,
        kcal: 350
      })
    })
    const res = await fetch(`https://fittrackerpro-backend.onrender.com/api/calories/today?username=${username}`)
    const data = await res.json()
    setTotalKcal(data.total.kcal)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>FitTracker WebApp</h1>
      <p>Ответ от API: <strong>{message}</strong></p>

      <button onClick={startCycle}>▶️ Запустить тренировочный цикл</button>
      <button onClick={getWorkout}>🏋️‍♂️ Показать тренировку</button>
      <button onClick={addFood}>🍽 Добавить гречку</button>

      {workout.length > 0 && (
        <div>
          <h3>Сегодняшняя тренировка:</h3>
          <ul>{workout.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}

      {totalKcal > 0 && <p>Съедено сегодня: <strong>{totalKcal}</strong> ккал</p>}
    </div>
  )
}

export default App
