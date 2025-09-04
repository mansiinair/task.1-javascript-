import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Fix Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function WeatherApp() {
  console.log("WeatherApp loaded ✅");

  const [position, setPosition] = useState([51.505, -0.09]); // Default London
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(""); // input box value

  const API_KEY = "7cf74205dacb1e27b769521e53e4b988"; // 🔑 Your API key

  // ✅ Get user location on first load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("User position:", latitude, longitude);
          setPosition([latitude, longitude]);
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          console.warn("Geolocation denied, using default London");
          fetchWeatherByCoords(position[0], position[1]);
        }
      );
    } else {
      console.warn("Geolocation not available, fallback to London");
      fetchWeatherByCoords(position[0], position[1]);
    }
  }, []);

  // ✅ Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("❌ Error fetching weather by coords:", err);
    }
  };

  // ✅ Fetch weather by city name
  const fetchWeatherByCity = async () => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setPosition([data.coord.lat, data.coord.lon]); // update map position
      } else {
        alert("❌ City not found, try again");
      }
    } catch (err) {
      console.error("❌ Error fetching weather by city:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
        🌦 Weather App with Maps
      </h1>

      {/* ✅ Search box */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "16px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={fetchWeatherByCity}
          style={{
            padding: "8px 12px",
            fontSize: "16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* ✅ Weather info */}
      {weather ? (
        <div style={{ marginBottom: "15px" }}>
          <h2>
            {weather.name}, {weather.sys?.country}
          </h2>
          <p>Temperature: {weather.main?.temp}°C</p>
          <p>Condition: {weather.weather?.[0]?.description}</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}

      {/* ✅ Map */}
      <MapContainer
        center={position}
        zoom={12}
        style={{ height: "400px", width: "100%", marginTop: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={position}>
          <Popup>
            {weather ? (
              <div>
                <strong>{weather.name}</strong> <br />
                {weather.main?.temp}°C, {weather.weather?.[0]?.description}
              </div>
            ) : (
              "Loading weather..."
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default WeatherApp;
