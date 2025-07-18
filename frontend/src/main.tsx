import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    console.log("Minimal frontend for CI/CD validation");
  </StrictMode>,
)
