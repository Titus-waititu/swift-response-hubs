import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress GSI_LOGGER warnings (multiple initialization warnings are harmless in StrictMode)
const originalWarn = console.warn;
console.warn = function (...args: any[]) {
  const message = String(args[0] || "");
  if (
    message.includes("[GSI_LOGGER]") ||
    message.includes("google.accounts.id.initialize") ||
    message.includes("Cross-Origin-Opener-Policy") ||
    message.includes("Cross-Origin-Embedder-Policy")
  ) {
    return; // Suppress GSI and COOP warnings
  }
  originalWarn.apply(console, args);
};

// Suppress COOP/COEP policy warnings as they're informational
const originalError = console.error;
console.error = function (...args: any[]) {
  const message = String(args[0] || "");
  if (
    message.includes("Cross-Origin-Opener-Policy") ||
    message.includes("Cross-Origin-Embedder-Policy") ||
    message.includes("postMessage")
  ) {
    return; // Suppress COOP/COEP errors
  }
  originalError.apply(console, args);
};

// Initialize theme before rendering
const initializeTheme = () => {
  const htmlElement = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const shouldBeDark = storedTheme ? storedTheme === "dark" : prefersDark;

  if (shouldBeDark) {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }
};

initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
