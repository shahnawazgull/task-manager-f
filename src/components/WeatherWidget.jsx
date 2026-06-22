import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { weatherService } from "../services/weather.service"

export default function WeatherWidget() {
  const [city, setCity]       = useState("Karachi")
  const [input, setInput]     = useState("Karachi")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchWeather = async (searchCity) => {
    setLoading(true)
    try {
      const data = await weatherService.getByCity(searchCity)
      setWeather(data)
      setCity(searchCity)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(city)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) fetchWeather(input.trim())
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search city..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : weather ? (
        <div className="flex items-center gap-3">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.condition}
            className="w-12 h-12"
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {weather.city}, {weather.country}
            </p>
            <p className="text-xl font-bold text-gray-800">
              {Math.round(weather.temperature)}°C
            </p>
            <p className="text-xs text-gray-400 capitalize">{weather.description}</p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-2">No weather data</p>
      )}
    </div>
  )
}