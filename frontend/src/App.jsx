... (обрезано для краткости)
  const [weightHistory, setWeightHistory] = useState([])
  const [progress, setProgress] = useState([])

  ...

  const loadProgress = async () => {
    const res = await fetch(`https://fittrackerpro-backend.onrender.com/api/progress?username=${username}`)
    const data = await res.json()
    setProgress(data)
  }

  ...

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