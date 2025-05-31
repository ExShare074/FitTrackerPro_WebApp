import React, { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

const API_URL = "https://fittrackerpro-backend.fly.dev";

const App = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [training, setTraining] = useState(null);
  const [duration, setDuration] = useState(8);
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
      setTraining(data.weeks?.[0]?.days?.[0]);
    } catch (err) {
      setMessage("Ошибка запуска цикла");
    }
  };

  const handleGetCurrentTraining = async () => {
    try {
      const res = await fetch(`${API_URL}/current_training?username=${username}`);
      const data = await res.json();
      setTraining(data);
    } catch (err) {
      setMessage("Ошибка загрузки тренировки");
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

      <button
        className="bg-green-600 px-4 py-2 rounded text-white mt-2 ml-2"
        onClick={handleGetCurrentTraining}
      >
        Показать тренировку
      </button>

      {message && <p className="mt-4 text-yellow-400">{message}</p>}

      {training && (
        <div className="mt-4 bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Текущая тренировка</h2>
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