import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';
import { HeroUIProvider } from '@heroui/system'
import { XyrlanTableProvider } from "xyrlan-table";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>
);
