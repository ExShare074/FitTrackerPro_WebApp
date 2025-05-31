import React, { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function App() {
  const [message, setMessage] = useState('')
  const [workout, setWorkout] = useState([])
  const [totalKcal, setTotalKcal] = useState(0)
  const [weekStats, setWeekStats] = useState([])
  const [weekOffset, setWeekOffset] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [weight, setWeight] = useState('')
  const [weightHistory, setWeightHistory] = useState([])
  const [progress, setProgress] = useState([])
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

  const loadGraph = async (offset = 0) => {
    const res = await fetch(`https://fittrackerpro-backend.onrender.com/api/calories/week?username=${username}&offset=${offset}`)
    const data = await res.json()
    setWeekStats(data)
  }

  const handlePrevWeek = () => {
    const newOffset = weekOffset + 1
    setWeekOffset(newOffset)
    loadGraph(newOffset)
  }

  const handleNextWeek = () => {
    if (weekOffset === 0) return
    const newOffset = weekOffset - 1
    setWeekOffset(newOffset)
    loadGraph(newOffset)
  }

  const submitFeedback = async () => {
    if (!feedback.trim()) return
    await fetch('https://fittrackerpro-backend.onrender.com/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message: feedback })
    })
    WebApp.showAlert('Спасибо за обратную связь!')
    setFeedback('')
  }

  const submitWeight = async () => {
    if (!weight.trim()) return
    await fetch('https://fittrackerpro-backend.onrender.com/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, kg: parseFloat(weight) })
    })
    setWeight('')
    loadWeightHistory()
  }

  const loadWeightHistory = async () => {
    const res = await fetch(`https://fittrackerpro-backend.onrender.com/api/weight?username=${username}`)
    const data = await res.json()
    setWeightHistory(data)
  }

  const loadProgress = async () => {
    const res = await fetch(`https://fittrackerpro-backend.onrender.com/api/progress?username=${username}`)
    const data = await res.json()
    setProgress(data)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>FitTracker WebApp</h1>
      <p>Ответ от API: <strong>{message}</strong></p>

      <button onClick={startCycle}>▶️ Запустить тренировочный цикл</button>
      <button onClick={getWorkout}>🏋️‍♂️ Показать тренировку</button>
      <button onClick={addFood}>🍽 Добавить гречку</button>
      <button onClick={() => loadGraph(weekOffset)}>📊 Показать график калорий</button>

      {workout.length > 0 && (
        <div>
          <h3>Сегодняшняя тренировка:</h3>
          <ul>{workout.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}

      {totalKcal > 0 && <p>Съедено сегодня: <strong>{totalKcal}</strong> ккал</p>}

      {weekStats.length > 0 && (
        <div>
          <h3>График калорий — неделя -{weekOffset}</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <button onClick={handlePrevWeek}>⏪</button>
            <button onClick={handleNextWeek} disabled={weekOffset === 0}>⏩</button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weekStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="kcal" stroke="#8884d8" name="Калории" />
              <Line type="monotone" dataKey="protein" stroke="#82ca9d" name="Белки" />
              <Line type="monotone" dataKey="fat" stroke="#ffc658" name="Жиры" />
              <Line type="monotone" dataKey="carbs" stroke="#ff7300" name="Углеводы" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>График веса</h3>
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Ваш вес (кг)" />
        <button onClick={submitWeight}>➕ Добавить вес</button>
        {weightHistory.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="kg" stroke="#ff1493" name="Вес (кг)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Прогресс по тренировкам</h3>
        <button onClick={loadProgress}>📆 Показать прогресс</button>
        {progress.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 7]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#32cd32" name="Дней завершено" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Обратная связь</h3>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} style={{ width: '100%' }} placeholder="Ваши предложения, пожелания..." />
        <button onClick={submitFeedback}>📩 Отправить</button>
      </div>
    </div>
  )
}

export default App