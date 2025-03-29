import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./App";
import { Analytics } from "@vercel/analytics/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
