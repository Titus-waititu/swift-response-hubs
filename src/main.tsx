import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress GSI_LOGGER warnings (multiple initialization warnings are harmless in StrictMode)
const originalWarn = console.warn;
console.warn = function (...args: any[]) {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("[GSI_LOGGER]") ||
      args[0].includes("google.accounts.id.initialize"))
  ) {
    return; // Suppress GSI warnings
  }
  originalWarn.apply(console, args);
};

// Suppress COOP/COEP policy warnings as they're informational
const originalError = console.error;
console.error = function (...args: any[]) {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Cross-Origin-Opener-Policy") ||
      args[0].includes("Cross-Origin-Embedder-Policy"))
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
