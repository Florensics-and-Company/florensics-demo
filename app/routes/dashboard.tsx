import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";

import dashboardTestStyles from "../dashboard-test.css";
import florensicsLogo from "../images/florensics.png";
import { MapWindow } from "~/components/MapWindow.client";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: dashboardTestStyles },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Demo Dashboard - Florensics" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

// Client-side map component
function DashboardMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || !mapRef.current) return;

    // Dynamically import Leaflet
    import("leaflet").then((module) => {
      // Access the default export
      const L = module.default || module;

      if (mapInstanceRef.current) return; // Map already initialized

      // Initialize map
      const map = L.map(mapRef.current!).setView([38.7223, -9.1393], 13);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add marker
      L.marker([38.7223, -9.1393])
        .addTo(map)
        .bindPopup("<strong>Sensor Location</strong><br>Lisbon, Portugal")
        .openPopup();

      mapInstanceRef.current = map;
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      id="map"
      style={{ height: "350px", borderRadius: "16px" }}
    />
  );
}

export default function DashboardTest() {
  const [temperature, setTemperature] = useState("--");
  const [humidity, setHumidity] = useState("--");
  const [fire, setFire] = useState("--");
  const [fireAnal, setFireAnal] = useState("--");
  const [smoke, setSmoke] = useState("--");
  const [smokeWarning, setSmokeWarning] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // Apply demo-dark class to html and body elements
  useEffect(() => {
    document.documentElement.classList.add("demo-dark");
    document.body.classList.add("demo-dark");

    return () => {
      document.documentElement.classList.remove("demo-dark");
      document.body.classList.remove("demo-dark");
    };
  }, []);

  useEffect(() => {
    // Simulated sensor data update (replace with actual API calls)
    const updateSensorData = () => {
      fetch("/status").then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setTemperature(data.temp?.toFixed(1) || "--");
            setHumidity(data.hum?.toFixed(1) || "--");
            setFire(data.flameBinary ? "Yes" : "No");
            setFireAnal(data.flame?.toFixed(1) || "--");
            const smokeLevel = data.gas ? data.gas * 100 : 0;
            setSmoke(data.gas ? smokeLevel.toFixed(1) : "--");
            setSmokeWarning(smokeLevel > 75);
            if (data.alert && isSoundEnabled) {
              const audio = new Audio(
                "https://www.myinstants.com/media/sounds/tethys.mp3",
              );
              audio.play();
            }
          });
        }
      });
    };

    // Initial update
    updateSensorData();

    // Update every 5 seconds
    const interval = setInterval(updateSensorData, 1000);

    return () => clearInterval(interval);
  }, [isSoundEnabled]);

  return (
    <div
      className="demo-dark"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header>
        <nav className="demo-nav">
          <a
            href="https://florensics.pt"
            className="logo-container"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img src={florensicsLogo} alt="Florensics Logo" className="logo" />
            <h1>Florensics</h1>
          </a>
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid #97BC62",
              background: isSoundEnabled ? "#97BC62" : "transparent",
              color: isSoundEnabled ? "#0a0a0a" : "#97BC62",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            title={isSoundEnabled ? "Sound On" : "Sound Off"}
          >
            {isSoundEnabled ? "🔊" : "🔇"} Sound {isSoundEnabled ? "On" : "Off"}
          </button>
        </nav>
      </header>
      <main style={{ flex: 1 }}>
        <div className="dashboard-container">
          <div className="dashboard-grid">
            <div className="dashboard-box" id="temperature-box">
              <h2>Temperature</h2>
              <div className="dashboard-value" id="temperature-value">
                {temperature} °C
              </div>
            </div>
            <div className="dashboard-box" id="humidity-box">
              <h2>Humidity</h2>
              <div className="dashboard-value" id="humidity-value">
                {humidity} %
              </div>
            </div>
            <div
              className={`dashboard-box ${fire === "Yes" ? "fire-active" : ""}`}
              id="fire-box"
            >
              <h2>Fire</h2>
              <div className="dashboard-value" id="fire-value" style={{ color: fire === "Yes" ? "#FF4C4C" : "inherit" }}>
                {fire}
              </div>
              <div className="dashboard-subvalue" id="smoke-warning">
                {fireAnal}
              </div>
            </div>
            <div className="dashboard-box" id="smoke-box">
              <h2>Smoke</h2>
              <div className="dashboard-value" id="smoke-value">
                {smoke}
              </div>
              {smokeWarning ? (
                <div className="dashboard-warning" id="smoke-warning">
                  Abnormal level
                </div>
              ) : null}
            </div>
          </div>
          <div className="dashboard-map">
            <h2>Location</h2>
            <ClientOnly>
              {() => {
                return <MapWindow status={{ hum: humidity, temp: temperature, flame: fire }} />;
              }}
            </ClientOnly>
          </div>
        </div>
      </main>
      <footer>
        <div className="container">
          <p>&copy; 2025 Florensics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
