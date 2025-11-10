import type { LinksFunction } from "@remix-run/node";
import { Fragment } from "react/jsx-runtime";

import dashboardTestStyles from "../dashboard-test.css";
import florensicsLogo from "../images/florensics.png";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: dashboardTestStyles },
];

export default function DashboardTest() {
  return (
    <Fragment>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Demo Dashboard</title>
        <link rel="icon" type="image/png" sizes="32x32" href={florensicsLogo} />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin="anonymous"
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          crossOrigin="anonymous"
        ></script>
        <script defer src="dashboard.js"></script>
      </head>
      <body className="demo-dark">
        <header>
          <nav className="demo-nav">
            <a
              href="https://florensics.pt"
              className="logo-container"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={florensicsLogo}
                alt="Florensics Logo"
                className="logo"
              />
              <h1>Florensics</h1>
            </a>
          </nav>
        </header>
        <main>
          <div className="dashboard-container">
            <div className="dashboard-grid">
              <div className="dashboard-box" id="temperature-box">
                <h2>Temperature</h2>
                <div className="dashboard-value" id="temperature-value">
                  -- °C
                </div>
              </div>
              <div className="dashboard-box" id="humidity-box">
                <h2>Humidity</h2>
                <div className="dashboard-value" id="humidity-value">
                  -- %
                </div>
              </div>
              <div className="dashboard-box" id="fire-box">
                <h2>Fire</h2>
                <div className="dashboard-value" id="fire-value">
                  --
                </div>
              </div>
              <div className="dashboard-box" id="smoke-box">
                <h2>Smoke</h2>
                <div className="dashboard-value" id="smoke-value">
                  --
                </div>
                <div
                  className="dashboard-warning"
                  id="smoke-warning"
                  style={{ display: "none" }}
                >
                  Abnormal level
                </div>
              </div>
            </div>
            <div className="dashboard-map">
              <h2>Location</h2>
              <div
                id="map"
                style={{ height: "350px", borderRadius: "16px" }}
              ></div>
            </div>
          </div>
        </main>
        <footer>
          <div className="container">
            <p>&copy; 2025 Florensics. All rights reserved.</p>
          </div>
        </footer>
      </body> 
    </Fragment>
  );
}
