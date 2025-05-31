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
  const [showCalorieCalc, setShowCalorieCalc] = useState(false)
  const [foodName, setFoodName] = useState('')
  const [foodWeight, setFoodWeight] = useState('')
  const [foodResult, setFoodResult] = useState(null)
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

  const calculateCalories = async () => {
    if (!foodName.trim() || !foodWeight.trim()) return
    const res = await fetch(`https://fittrackerpro-backend.onrender.com/api/nutrition?query=${foodName}&weight=${foodWeight}`)
    const data = await res.json()
    setFoodResult(data)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>FitTracker WebApp</h1>
      <p>Ответ от API: <strong>{message}</strong></p>

      <button onClick={startCycle}>▶️ Запустить тренировочный цикл</button>
      <button onClick={getWorkout}>🏋️‍♂️ Показать тренировку</button>
      <button onClick={() => setShowCalorieCalc(!showCalorieCalc)}>📊 Калькулятор калорий</button>
      <button onClick={() => loadGraph(weekOffset)}>📈 Показать график калорий</button>

      {showCalorieCalc && (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Калькулятор калорий</h3>
          <input type="text" placeholder="Продукт (например: гречка)" value={foodName} onChange={e => setFoodName(e.target.value)} />
          <input type="number" placeholder="Масса (граммы)" value={foodWeight} onChange={e => setFoodWeight(e.target.value)} />
          <button onClick={calculateCalories}>Рассчитать</button>

          {foodResult && (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>{foodResult.product}</strong> на {foodWeight} г:</p>
              <ul>
                <li>Калории: {foodResult.kcal}</li>
                <li>Белки: {foodResult.protein} г</li>
                <li>Жиры: {foodResult.fat} г</li>
                <li>Углеводы: {foodResult.carbs} г</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Остальная часть интерфейса остаётся без изменений */}
    </div>
  )
}

export default App