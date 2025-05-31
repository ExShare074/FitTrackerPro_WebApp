import React, { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

const API_URL = "https://fittrackerpro-backend.fly.dev";

const App = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [training, setTraining] = useState(null);
  const [duration, setDuration] = useState(8);
  const [weekIndex, setWeekIndex] = useState(0);
  const [cycle, setCycle] = useState([]);
  const [weights, setWeights] = useState({
    "Приседания со штангой": 60,
    "Жим ногами": 80,
    "Жим штанги лежа": 50,
    "Жим гантелей лежа": 30,
    "Тяга штанги в наклоне": 40
  });

  useEffect(() => {
    if (WebApp?.initDataUnsafe?.user?.username) {
      setUsername(WebApp.initDataUnsafe.user.username);
    }
  }, []);

  const handleStartCycle = async () => {
    try {
      const res = await fetch(`${API_URL}/start_cycle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, duration, weights })
      });
      const data = await res.json();
      setMessage("Тренировочный цикл запущен");
      setCycle(data.weeks);
      setWeekIndex(0);
      setTraining(data.weeks?.[0]?.days?.[0]);
    } catch (err) {
      setMessage("Ошибка запуска цикла");
    }
  };

  const handleNextWeek = () => {
    if (weekIndex < cycle.length - 1) {
      const nextIndex = weekIndex + 1;
      setWeekIndex(nextIndex);
      setTraining(cycle[nextIndex].days[0]);
    }
  };

  const handlePrevWeek = () => {
    if (weekIndex > 0) {
      const prevIndex = weekIndex - 1;
      setWeekIndex(prevIndex);
      setTraining(cycle[prevIndex].days[0]);
    }
  };

  return (
    <div className="p-4 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">FitTracker</h1>

      <div className="mb-4">
        <label className="block mb-1">Длительность цикла (нед):</label>
        <select
          className="text-black p-2 rounded"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={12}>12</option>
        </select>
      </div>

      {Object.keys(weights).map((exercise) => (
        <div className="mb-2" key={exercise}>
          <label className="block mb-1">{exercise} (кг):</label>
          <input
            className="text-black p-2 rounded w-full"
            type="number"
            value={weights[exercise]}
            onChange={(e) =>
              setWeights({ ...weights, [exercise]: parseFloat(e.target.value) })
            }
          />
        </div>
      ))}

      <button
        className="bg-blue-600 px-4 py-2 rounded text-white mt-4"
        onClick={handleStartCycle}
      >
        Запустить тренировочный цикл
      </button>

      {message && <p className="mt-4 text-yellow-400">{message}</p>}

      {training && (
        <div className="mt-4 bg-gray-800 p-4 rounded">
          <div className="flex justify-between items-center mb-2">
            <button
              className="bg-gray-700 px-2 py-1 rounded"
              onClick={handlePrevWeek}
              disabled={weekIndex === 0}
            >
              ◀ Неделя {weekIndex}
            </button>
            <span className="text-lg font-semibold">Неделя {weekIndex + 1}</span>
            <button
              className="bg-gray-700 px-2 py-1 rounded"
              onClick={handleNextWeek}
              disabled={weekIndex >= cycle.length - 1}
            >
              Неделя {weekIndex + 2} ▶
            </button>
          </div>
          <ul>
            {Object.entries(training.exercises).map(([name, weight]) => (
              <li key={name}>{name}: {weight} кг</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;